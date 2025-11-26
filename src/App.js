import React, { useState, useEffect } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchEmissionsData } from './services/dataService';
import { getEmissionStatus, getStatusColor } from './utils/statusCalculator';
import { COLORS } from './utils/constants';
import styles from './styles/styles';

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);
  const [sensorActive, setSensorActive] = useState(true); // NEW: Track sensor status

  const loadData = async () => {
    console.log('Starting to load data...');
    console.log('REACT_APP_USE_MOCK_DATA:', process.env.REACT_APP_USE_MOCK_DATA);
    setLoading(true);
    setError(null);
    try {
      const result = await fetchEmissionsData(false); // Explicitly false
      console.log('Data loaded from API:', result);
      console.log('First item:', result[0]);
      setData(result);
      setLastUpdate(new Date());
      
      // NEW: Check if sensors are actively transmitting (data within last 5 minutes)
      if (result.length > 0) {
        const latestTimestamp = new Date(result[result.length - 1].timestamp);
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const isActive = latestTimestamp > fiveMinutesAgo;
        setSensorActive(isActive);
        
        if (!isActive) {
          const minutesSince = Math.floor((Date.now() - latestTimestamp) / 60000);
          console.warn(`⚠️ Sensors inactive. Last reading was ${minutesSince} minutes ago`);
        }
      } else {
        setSensorActive(false);
        console.warn('⚠️ No sensor data available');
      }

      const sortedResult = result;
      if (true) {
        const latestReading = sortedResult[sortedResult.length - 1];
        
        if (latestReading && latestReading.timestamp) {
          const sensorTime = new Date(latestReading.timestamp);
          const browserTime = new Date();
          const delayInSeconds = (browserTime.getTime() - sensorTime.getTime()) / 1000;
          
          console.log(`End-to-end delay: ${delayInSeconds.toFixed(2)} seconds`);
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load emissions data. Please try again.');
      setSensorActive(false); // NEW: Mark sensors as inactive on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading && data.length === 0) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading emissions data...</p>
        <p style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>
          Check console for debug info (F12)
        </p>
      </div>
    );
  }

  if (error && data.length === 0) {
    return (
      <div style={styles.loadingContainer}>
        <p style={styles.errorText}>{error}</p>
        <button onClick={loadData} style={styles.retryButton}>Retry</button>
      </div>
    );
  }

  // Calculate metrics
  const latestReading = data[data.length - 1] || {};
  const overallStatus = getEmissionStatus(latestReading.CO, latestReading.CO2);
  const avgCO = (data.reduce((sum, d) => sum + d.CO, 0) / data.length).toFixed(1);
  const avgCO2 = (data.reduce((sum, d) => sum + d.CO2, 0) / data.length).toFixed(1);

  // Status distribution
  const statusCounts = data.reduce((acc, item) => {
    const status = getEmissionStatus(item.CO, item.CO2);
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value
  }));

  const CHART_COLORS = {
    Good: COLORS.statusGood,
    Moderate: COLORS.statusModerate,
    Alert: COLORS.statusAlert
  };

  return (
    <div style={{ backgroundColor: COLORS.background, minHeight: '100vh', padding: '20px' }}>
      {/* Header - UPDATED with sensor status */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1 style={{ margin: 0, color: COLORS.primary }}>
              🌍 Real-Time Vehicle Emissions Dashboard
            </h1>
            <p style={{ margin: '10px 0 0 0', color: '#666' }}>
              Last Updated: {lastUpdate?.toLocaleTimeString() || 'Loading...'}
            </p>
          </div>
          
          {/* NEW: Sensor Status Badge */}
          <div style={{
            padding: '10px 20px',
            borderRadius: '20px',
            backgroundColor: sensorActive ? '#E8F5E9' : '#FFF3E0',
            color: sensorActive ? '#2E7D32' : '#E65100',
            border: `2px solid ${sensorActive ? '#81C784' : '#FFB74D'}`,
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '18px' }}>
              {sensorActive ? '🟢' : '🟡'}
            </span>
            {sensorActive ? 'Sensors Active' : 'Sensors Inactive'}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px', 
        marginBottom: '20px' 
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>Current Status</h3>
          <p style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            margin: 0,
            color: getStatusColor(overallStatus)
          }}>
            {overallStatus}
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>Avg CO Level</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: COLORS.primary }}>
            {avgCO} <span style={{ fontSize: '16px' }}>ppm</span>
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>Avg CO₂ Level</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: COLORS.primary }}>
            {avgCO2} <span style={{ fontSize: '16px' }}>ppm</span>
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>Active Devices</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: COLORS.primary }}>
            {data.length}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '20px', 
        marginBottom: '20px' 
      }}>
        {/* Line Chart */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0' }}>Emissions Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(time) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="CO" stroke="#FF6B6B" name="CO (ppm)" />
              <Line type="monotone" dataKey="CO2" stroke="#4ECDC4" name="CO₂ (ppm)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0' }}>Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Table */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 20px 0' }}>Recent Readings</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: COLORS.background }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Device ID</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Location</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>CO (ppm)</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>CO₂ (ppm)</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(-10).reverse().map((item, index) => {
                const status = getEmissionStatus(item.CO, item.CO2);
                return (
                  <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>{item.device_id}</td>
                    <td style={{ padding: '12px' }}>{item.location}</td>
                    <td style={{ padding: '12px' }}>{item.CO}</td>
                    <td style={{ padding: '12px' }}>{item.CO2}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: getStatusColor(status),
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;