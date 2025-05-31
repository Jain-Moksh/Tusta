import { useState, useCallback } from 'react';

export const useTrendlines = (onClear = () => {}) => {
  const [trendlines, setTrendlines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [hoveredTrendline, setHoveredTrendline] = useState(null);

  const handleChartClick = useCallback((event, chartContext, config) => {
    if (!config || !chartContext) {
      console.log("Invalid click event data");
      return;
    }

    const xValue = chartContext.w.globals.seriesX[0][config.dataPointIndex];
    
    const yValue = parseFloat(config.y);

    if (!xValue || isNaN(yValue)) {
      console.log("Invalid coordinates:", { x: xValue, y: yValue });
      return;
    }

    const clickedPoint = {
      x: xValue,
      y: yValue
    };

    console.log("Clicked point:", clickedPoint);

    if (!isDrawing) {
      setIsDrawing(true);
      setStartPoint(clickedPoint);
      console.log("Started drawing at:", {
        timestamp: new Date(clickedPoint.x).toISOString(),
        price: clickedPoint.y.toFixed(2)
      });
    } else {
      setIsDrawing(false);
      const newTrendline = {
        id: Date.now(),
        start: startPoint,
        end: clickedPoint,
        color: '#2196F3'
      };
      setTrendlines(prev => [...prev, newTrendline]);
      setStartPoint(null);
      console.log("Completed trendline:", {
        start: {
          timestamp: new Date(startPoint.x).toISOString(),
          price: startPoint.y.toFixed(2)
        },
        end: {
          timestamp: new Date(clickedPoint.x).toISOString(),
          price: clickedPoint.y.toFixed(2)
        }
      });
    }
  }, [isDrawing, startPoint]);

  const handleTrendlineDoubleClick = useCallback((trendline) => {
    console.log("Double-clicked trendline:", {
      start: {
        timestamp: new Date(trendline.start.x).toISOString(),
        price: trendline.start.y.toFixed(2)
      },
      end: {
        timestamp: new Date(trendline.end.x).toISOString(),
        price: trendline.end.y.toFixed(2)
      }
    });
  }, []);

  const handleTrendlineDrag = useCallback((trendline, newStart, newEnd) => {
    setTrendlines(prev =>
      prev.map(t =>
        t.id === trendline.id
          ? { ...t, start: newStart, end: newEnd }
          : t
      )
    );
    console.log("Updated trendline:", {
      start: {
        timestamp: new Date(newStart.x).toISOString(),
        price: newStart.y.toFixed(2)
      },
      end: {
        timestamp: new Date(newEnd.x).toISOString(),
        price: newEnd.y.toFixed(2)
      }
    });
  }, []);

  const deleteTrendline = useCallback((id) => {
    setTrendlines(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearAllTrendlines = useCallback(() => {
    setTrendlines([]);
    setIsDrawing(false);
    setStartPoint(null);
    onClear();
  }, [onClear]);

  return {
    trendlines,
    isDrawing,
    startPoint,
    hoveredTrendline,
    setHoveredTrendline,
    handleChartClick,
    handleTrendlineDoubleClick,
    handleTrendlineDrag,
    deleteTrendline,
    clearAllTrendlines
  };
};