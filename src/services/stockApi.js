export const fetchStockData = async () => {
  try {
    const response = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=ETHUSDT&interval=1d&limit=100`
    );

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawData = await response.json();
    console.log("Raw API Response:", rawData);

    // Binance returns array-based OHLC data
    const formattedData = rawData.map((item) => ({
      date: new Date(item[0]).toISOString().split("T")[0], // timestamp in ms
      open: parseFloat(item[1]),
      high: parseFloat(item[2]),
      low: parseFloat(item[3]),
      close: parseFloat(item[4]),
    }));

    console.log("Formatted Data:", formattedData);
    return formattedData;
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    throw error;
  }
};
