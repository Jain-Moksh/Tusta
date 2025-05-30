export const formatStockData = (stockData) => {
    if (!Array.isArray(stockData) || stockData.length === 0) {
        console.error("Invalid or empty data received:", stockData);
        return [];
    }

    try {
        const formattedData = stockData.map(dataPoint => ({
            x: new Date(dataPoint.date).getTime(),
            y: [
                dataPoint.open,
                dataPoint.high,
                dataPoint.low,
                dataPoint.close
            ]
        }));

        console.log("Formatted data points:", formattedData.length);
        return formattedData;
    } catch (error) {
        console.error("Error formatting data:", error);
        return [];
    }
}; 