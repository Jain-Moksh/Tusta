import React, { useEffect, useState, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import { fetchStockData } from '../../services/stockApi';
import { formatStockData } from '../../utils/formatData';
import { candleStickOptions } from '../../constants/chartOptions';

const TradingChart = () => {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchStockData();
        setStockData(data);
      } catch (err) {
        setError('Failed to fetch crypto data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const seriesData = useMemo(() => {
    if (!stockData) return [];
    return formatStockData(stockData);
  }, [stockData]);

  if (loading) {
    return (
      <div className="w-full h-[500px] bg-gray-900 rounded-lg p-4 flex items-center justify-center">
        <p className="text-white">Loading chart data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[500px] bg-gray-900 rounded-lg p-4 flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!seriesData || seriesData.length === 0) {
    return (
      <div className="w-full h-[500px] bg-gray-900 rounded-lg p-4 flex items-center justify-center">
        <p className="text-yellow-500">No data available to display</p>
      </div>
    );
  }

  const options = {
    ...candleStickOptions,
    title: {
      text: 'ETH/USDT Price',
      align: 'left',
      style: {
        fontSize: '16px',
        color: '#d1d4dc'
      }
    }
  };

  return (
    <div className="w-full h-[500px] bg-gray-900 rounded-lg p-4">
      <ReactApexChart
        options={options}
        series={[{ 
          name: 'ETH/USDT',
          data: seriesData 
        }]}
        type="candlestick"
        height={500}
      />
    </div>
  );
};

export default TradingChart; 