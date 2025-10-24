import AWS from 'aws-sdk';

// Configure AWS DynamoDB
const configureDynamoDB = () => {
  AWS.config.update({
    region: process.env.REACT_APP_AWS_REGION || 'eu-north-1',
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
  });
  
  return new AWS.DynamoDB.DocumentClient();
};

// Mock data for local development
const generateMockData = () => {
  const locations = ['Obinze', 'Futo Road', 'Ihiagwa market', 'Umuchima market', 'FUTO backgate'];
  const now = Date.now();
  
  return Array.from({ length: 25 }, (_, i) => ({
    device_id: `DEVICE-${String(i + 1).padStart(3, '0')}`,
    CO: Math.floor(Math.random() * 100) + 10,
    CO2: Math.floor(Math.random() * 800) + 300,
    location: locations[Math.floor(Math.random() * locations.length)],
    timestamp: new Date(now - (24 - i) * 3600000).toISOString()
  }));
};

// Fetch data from DynamoDB
export const fetchEmissionsData = async (useMockData = true) => {
  // Use mock data for local development
  if (useMockData || process.env.REACT_APP_USE_MOCK_DATA === 'true') {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
    return generateMockData();
  }

  // Real DynamoDB fetch
  try {
    const dynamoDB = configureDynamoDB();
    
    const params = {
      TableName: process.env.REACT_APP_DYNAMODB_TABLE_NAME || 'VehicleEmissionData',
      Limit: 25,
      ScanIndexForward: false
    };

    const result = await dynamoDB.scan(params).promise();
    
    // Sort by timestamp to ensure chronological order
    return result.Items.sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );
  } catch (error) {
    console.error('Error fetching from DynamoDB:', error);
    throw error;
  }
};

// Alternative: Using Amplify API (if you set up Amplify API)
/*
import { API } from 'aws-amplify';

export const fetchEmissionsData = async () => {
  try {
    const apiName = 'emissionsAPI';
    const path = '/emissions';
    const response = await API.get(apiName, path);
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
*/
