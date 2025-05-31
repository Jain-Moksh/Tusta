import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import ReactApexChart from 'react-apexcharts';
import { fetchStockData } from '../../services/stockApi';
import { formatStockData } from '../../utils/formatData';
import { candleStickOptions } from '../../constants/chartOptions';
import { useTrendlines } from '../../hooks/useTrendlines';

const TradingChart = ({ 
  onTrendlinesUpdate, 
  onOHLCUpdate,
  onCoordinatesUpdate,
  clickedCoordinates: externalClickedCoordinates 
}) => {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentOHLC, setCurrentOHLC] = useState(null);
  const [tempLine, setTempLine] = useState(null);
  const chartRef = useRef(null);
  
  const clearCoordinates = useCallback(() => {
    onCoordinatesUpdate({ start: null, end: null });
    setTempLine(null);
  }, [onCoordinatesUpdate]);

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
  } = useTrendlines(clearCoordinates);

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
    <div className="hidden lg:block computer:hidden w-full bg-gray-800/50 rounded-lg px-4 py-0 mt-2 lg:p-3 lg:mt-3 xl:px-5 xl:mt-2">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-3 xl:gap-4">
        <div className="space-y-1 xl:space-y-2">
          <p className="text-gray-400 text-sm lg:text-xs xl:text-base computer:text-base">Symbol</p>
          <p className="text-white font-medium text-base lg:text-sm xl:text-xl computer:text-lg">ETH/USDT</p>
        </div>
        <div className="space-y-1 xl:space-y-2">
          <p className="text-gray-400 text-sm lg:text-xs xl:text-base computer:text-base">Interval</p>
          <p className="text-white font-medium text-base lg:text-sm xl:text-xl computer:text-lg">1D</p>
        </div>
        <div className="space-y-1 xl:space-y-2">
          <p className="text-gray-400 text-sm lg:text-xs xl:text-base computer:text-base">Exchange</p>
          <p className="text-white font-medium text-base lg:text-sm xl:text-xl computer:text-lg">Binance</p>
        </div>
        <div className="space-y-1 xl:space-y-2">
          <p className="text-gray-400 text-sm lg:text-xs xl:text-base computer:text-base">Last Updated</p>
          <p className="text-white font-medium text-base lg:text-sm xl:text-xl computer:text-lg">
            {currentOHLC ? new Date(currentOHLC.timestamp).toLocaleTimeString() : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );

  const handleChartPointClick = (event, chartContext, config) => {
    if (!config || typeof config.dataPointIndex === 'undefined') {
      console.log("Invalid click: No dataPointIndex");
      return;
    }

    // Ignore click if both coordinates are already set
    if (externalClickedCoordinates.start && externalClickedCoordinates.end) {
      return;
    }

    try {
      const dataPoint = seriesData[config.dataPointIndex];
      let yValue;

      // Safely get y-value from chart context if available
      if (chartContext?.w?.globals?.yaxis?.[0]?.toValue && event.offsetY !== undefined) {
        yValue = chartContext.w.globals.yaxis[0].toValue(event.offsetY);
      } else {
        // Fallback to using the dataPoint values
        yValue = dataPoint.y || dataPoint.close;
      }
      
      const clickedPoint = {
        x: parseFloat(dataPoint.x),
        y: parseFloat(yValue)
      };

      if (!externalClickedCoordinates.start) {
        onCoordinatesUpdate({ ...externalClickedCoordinates, start: clickedPoint });
        setTempLine({
          start: clickedPoint,
          end: clickedPoint
        });
      } else {
        onCoordinatesUpdate({ ...externalClickedCoordinates, end: clickedPoint });
        setTempLine(prev => ({
          ...prev,
          end: clickedPoint
        }));
      }
    } catch (error) {
      console.error('Error handling chart click:', error);
    }
  };

  const handleChartMouseMove = (event, chartContext, config) => {
    if (!externalClickedCoordinates.start || externalClickedCoordinates.end) return;

    try {
      if (!chartContext?.w?.globals?.yaxis?.[0]?.toValue || 
          !chartContext?.w?.globals?.xaxis?.toValue ||
          event.offsetX === undefined ||
          event.offsetY === undefined) {
        return;
      }

      const yValue = chartContext.w.globals.yaxis[0].toValue(event.offsetY);
      const xValue = chartContext.w.globals.xaxis.toValue(event.offsetX);

      setTempLine(prev => ({
        ...prev,
        end: { 
          x: xValue,
          y: parseFloat(yValue)
        }
      }));
    } catch (error) {
      console.error('Error updating temp line:', error);
    }
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
        mousemove: handleChartMouseMove
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
    annotations: {
      position: 'front',
      points: tempLine ? [
        {
          x: tempLine.start.x,
          y: tempLine.start.y,
          marker: {
            size: 6,
            fillColor: '#FFD700',
            strokeColor: '#FFD700',
            strokeWidth: 2
          }
        },
        {
          x: tempLine.end.x,
          y: tempLine.end.y,
          marker: {
            size: 6,
            fillColor: '#FFD700',
            strokeColor: '#FFD700',
            strokeWidth: 2
          }
        }
      ] : [],
      xaxis: [],
      yaxis: [],
      lines: tempLine ? [
        {
          type: 'line',
          x1: tempLine.start.x,
          y1: tempLine.start.y,
          x2: tempLine.end.x,
          y2: tempLine.end.y,
          borderColor: '#FFD700',
          strokeWidth: 2,
          opacity: 1
        }
      ] : []
    }
  };

  return (
    <div className="w-full h-full bg-gray-900 rounded-lg p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-4 lg:space-x-3 xl:space-x-4">
          <button
            className="px-3 py-1.5 lg:px-2 lg:py-1 xl:px-3 xl:py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-[10px] sm:text-xstext-xs md:text-sm lg:text-sm xl:text-base"
            onClick={clearAllTrendlines}
          >
            Clear All Trendlines
          </button>
          {isDrawing && (
            <span className="text-yellow-500 text-base lg:text-sm xl:text-lg computer:text-xl">
              Click on another point to complete the trendline
            </span>
          )}
        </div>
        <div className="text-[10px] sm:text-xs md:text-sm lg:text-xs xl:text-base computer:text-xl text-gray-400">
          Single-click : To Show coordinates 
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

      {/* Trendline Coordinates - Visible on screens larger than 1024px */}
      <div className="hidden lg:block computer:hidden bg-gray-800/50 rounded-lg p-4 mt-4 lg:p-3 lg:mt-3 xl:p-4 xl:mt-4">
        <div className="flex justify-between mb-3 lg:mb-2 xl:mb-3">
          <span className="text-gray-400 text-base lg:text-sm xl:text-base">Trendline Coordinates</span>
          <button
            className="px-3 py-1 lg:px-2 lg:py-0.5 xl:px-3 xl:py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm lg:text-xs xl:text-sm"
            onClick={clearCoordinates}
          >
            Clear
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:gap-2 xl:gap-3">
          <div className="bg-gray-900/50 rounded-lg p-3 lg:p-2 xl:p-3">
            <div className="text-sm lg:text-xs xl:text-sm text-gray-400 mb-1">Start Coordinates</div>
            <div className="text-lg lg:text-base xl:text-lg text-white">
              {externalClickedCoordinates.start 
                ? `(${new Date(externalClickedCoordinates.start.x).toLocaleDateString()}, ${parseFloat(externalClickedCoordinates.start.y).toFixed(2)})`
                : 'No trendline'
              }
            </div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3 lg:p-2 xl:p-3">
            <div className="text-sm lg:text-xs xl:text-sm text-gray-400 mb-1">End Coordinates</div>
            <div className="text-lg lg:text-base xl:text-lg text-white">
              {externalClickedCoordinates.end 
                ? `(${new Date(externalClickedCoordinates.end.x).toLocaleDateString()}, ${parseFloat(externalClickedCoordinates.end.y).toFixed(2)})`
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