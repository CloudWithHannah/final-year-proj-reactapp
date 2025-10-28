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

// Fetch data from your API Gateway
export const fetchEmissionsData = async (useMockData = false) => {
  if (useMockData || process.env.REACT_APP_USE_MOCK_DATA === 'true') {
    console.log("Using MOCK data");
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
    return generateMockData();
  }

  // --- Real API Gateway Fetch ---
  try {
    console.log("Fetching REAL data from API Gateway...");
    const API_URL = process.env.REACT_APP_API_URL;

    if (!API_URL) {
      console.error("Error: REACT_APP_API_URL is not set in your .env file.");
      throw new Error("API URL is not configured.");
    }

    // Use the standard browser fetch to call your GET endpoint
    const response = await fetch(API_URL);

    if (!response.ok) {
      // Handle HTTP errors (e.g., 500, 404, 403)
      const errorText = await response.text();
      console.error("API request failed:", errorText);
      throw new Error(`API request failed with status ${response.status}`);
    }

    // Parse the JSON body from the response (which is what your Lambda sends)
    const data = await response.json();

    // Sort by timestamp to ensure chronological order
    return data.sort((a, b) =>
      new Date(a.timestamp) - new Date(b.timestamp)
    );

  } catch (error) {
    // --- MODIFIED CATCH BLOCK ---
    // If the API fetch fails, log the error and return mock data as a fallback.
    console.error('Error fetching REAL data from API Gateway. Falling back to MOCK data.', error);
    console.log("Using MOCK data as fallback.");
    return generateMockData();
  }
};


