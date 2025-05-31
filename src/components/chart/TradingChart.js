import React, { useEffect, useState, useMemo, useRef } from 'react';
import ReactApexChart from 'react-apexcharts';
import { fetchStockData } from '../../services/stockApi';
import { formatStockData } from '../../utils/formatData';
import { candleStickOptions } from '../../constants/chartOptions';
import { useTrendlines } from '../../hooks/useTrendlines';

const TradingChart = ({ onTrendlinesUpdate, onOHLCUpdate }) => {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentOHLC, setCurrentOHLC] = useState(null);
  const [clickedCoordinates, setClickedCoordinates] = useState({
    start: null,
    end: null
  });
  const chartRef = useRef(null);
  
  const {
    trendlines,
    isDrawing,
    hoveredTrendline,
    setHoveredTrendline,
    handleChartClick,
    handleTrendlineDoubleClick,
    handleTrendlineDrag,
    deleteTrendline,
    clearAllTrendlines
  } = useTrendlines();

  // Update parent component when trendlines change
  useEffect(() => {
    onTrendlinesUpdate(trendlines);
  }, [trendlines, onTrendlinesUpdate]);

  // Update OHLC data in parent component
  useEffect(() => {
    if (currentOHLC) {
      onOHLCUpdate(currentOHLC);
    }
  }, [currentOHLC, onOHLCUpdate]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchStockData();
        setStockData(data);
        // Set current OHLC from the latest data point
        if (data && data.length > 0) {
          const latest = data[data.length - 1];
          const ohlcData = {
            open: latest.open,
            high: latest.high,
            low: latest.low,
            close: latest.close,
            timestamp: latest.date
          };
          setCurrentOHLC(ohlcData);
        }
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

  const MarketSummary = () => (
    <div className="hidden md:block computer:hidden w-full bg-gray-800/50 rounded-lg p-4 mt-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <p className="text-gray-400 text-sm">Symbol</p>
          <p className="text-white font-medium">ETH/USDT</p>
        </div>
        <div className="space-y-1">
          <p className="text-gray-400 text-sm">Interval</p>
          <p className="text-white font-medium">1D</p>
        </div>
        <div className="space-y-1">
          <p className="text-gray-400 text-sm">Exchange</p>
          <p className="text-white font-medium">Binance</p>
        </div>
        <div className="space-y-1">
          <p className="text-gray-400 text-sm">Last Updated</p>
          <p className="text-white font-medium">
            {currentOHLC ? new Date(currentOHLC.timestamp).toLocaleTimeString() : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );

  const handleChartPointClick = (event, chartContext, config) => {
    if (typeof config.dataPointIndex === 'undefined') {
      console.log("Invalid click: No dataPointIndex");
      return;
    }

    // Ignore click if both coordinates are already set
    if (clickedCoordinates.start && clickedCoordinates.end) {
      return;
    }

    const dataPoint = seriesData[config.dataPointIndex];
    const clickedPoint = {
      x: new Date(dataPoint.x).getTime(),
      y: parseFloat(dataPoint.y || dataPoint.close) // Use close price if y is not available
    };

    setClickedCoordinates(prev => {
      if (!prev.start) {
        return { ...prev, start: clickedPoint };
      } else {
        return { ...prev, end: clickedPoint };
      }
    });
  };

  const clearCoordinates = () => {
    setClickedCoordinates({ start: null, end: null });
  };

  if (loading) {
    return (
      <div className="w-full h-[calc(100vh-12rem)] bg-gray-900 rounded-lg p-4 flex items-center justify-center">
        <p className="text-white">Loading chart data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[calc(100vh-12rem)] bg-gray-900 rounded-lg p-4 flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!seriesData || seriesData.length === 0) {
    return (
      <div className="w-full h-[calc(100vh-12rem)] bg-gray-900 rounded-lg p-4 flex items-center justify-center">
        <p className="text-yellow-500">No data available to display</p>
      </div>
    );
  }

  const options = {
    ...candleStickOptions,
    chart: {
      ...candleStickOptions.chart,
      events: {
        click: handleChartPointClick,
      },
      animations: {
        enabled: false
      },
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      }
    },
    tooltip: {
      enabled: true,
      shared: true,
      custom: ({ seriesIndex, dataPointIndex, w }) => {
        const o = w.globals.seriesCandleO[seriesIndex][dataPointIndex];
        const h = w.globals.seriesCandleH[seriesIndex][dataPointIndex];
        const l = w.globals.seriesCandleL[seriesIndex][dataPointIndex];
        const c = w.globals.seriesCandleC[seriesIndex][dataPointIndex];
        return `
          <div class="p-2">
            <div>O: ${o}</div>
            <div>H: ${h}</div>
            <div>L: ${l}</div>
            <div>C: ${c}</div>
          </div>
        `;
      }
    },
    annotations: {
      position: 'front',
      xaxis: trendlines.map(trendline => ({
        id: trendline.id,
        x: trendline.start.x,
        x2: trendline.end.x,
        y: trendline.start.y,
        y2: trendline.end.y,
        strokeDashArray: 0,
        borderColor: '#2196F3',
        opacity: 1,
        strokeWidth: 3,
        label: {
          borderColor: '#2196F3',
          style: {
            fontSize: '12px',
            color: '#fff',
            background: '#2196F3'
          }
        },
        draggable: true,
        events: {
          mouseenter: () => {
            setHoveredTrendline(trendline.id);
            document.body.style.cursor = 'grab';
          },
          mouseleave: () => {
            setHoveredTrendline(null);
            document.body.style.cursor = 'default';
          },
          mousedown: () => {
            document.body.style.cursor = 'grabbing';
          },
          mouseup: () => {
            document.body.style.cursor = 'grab';
          },
          dblclick: () => handleTrendlineDoubleClick(trendline),
          dragend: (e, { start, end }) => {
            handleTrendlineDrag(trendline, start, end);
            document.body.style.cursor = 'grab';
          }
        }
      }))
    }
  };

  return (
    <div className="w-full h-full bg-gray-900 rounded-lg p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={clearAllTrendlines}
          >
            Clear All Trendlines
          </button>
          {isDrawing && (
            <span className="text-yellow-500">
              Click on another point to complete the trendline
            </span>
          )}
        </div>
        <div className="text-sm text-gray-400">
          Single-click : Show coordinates 
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-[calc(100%-4rem)]">
        <ReactApexChart
          ref={chartRef}
          options={options}
          series={[{ 
            name: 'ETH/USDT',
            data: seriesData 
          }]}
          type="candlestick"
          height="100%"
          width="100%"
        />
        {trendlines.map(trendline => (
          hoveredTrendline === trendline.id && (
            <button
              key={`delete-${trendline.id}`}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              onClick={() => deleteTrendline(trendline.id)}
              style={{
                transform: 'translate(50%, -50%)'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )
        ))}
      </div>

      
      

      {/* Trendline Coordinates - Visible on screens smaller than computer */}
      <div className="block computer:hidden bg-gray-800/50 rounded-lg p-4 mt-4">
        <div className="flex justify-between mb-3">
          <span className="text-gray-400">Trendline Coordinates</span>
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={clearCoordinates}
          >
            Clear
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-900/50 rounded-lg p-3">
            <div className="text-sm text-gray-400 mb-1">Start Coordinates</div>
            <div className="text-lg text-white">
              {clickedCoordinates.start 
                ? `(${new Date(clickedCoordinates.start.x).toLocaleDateString()}, ${clickedCoordinates.start.y?.toFixed(2)})`
                : 'No trendline'
              }
            </div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3">
            <div className="text-sm text-gray-400 mb-1">End Coordinates</div>
            <div className="text-lg text-white">
              {clickedCoordinates.end 
                ? `(${new Date(clickedCoordinates.end.x).toLocaleDateString()}, ${clickedCoordinates.end.y?.toFixed(2)})`
                : 'No trendline'
              }
            </div>
          </div>
        </div>
      </div>

      {/* Market Summary */}
      <MarketSummary />

    </div>
  );
};

export default TradingChart; 