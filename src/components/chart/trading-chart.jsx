"use client"

import { useState, useRef, useEffect } from "react"
import Chart from "react-apexcharts"
import useTrendlines from "./useTrendlines"

const candleData = [
  { x: new Date("2023-06-01").getTime(), y: [132.5, 134.5, 131.5, 133.0] },
  { x: new Date("2023-06-02").getTime(), y: [133.0, 135.0, 132.0, 134.5] },
  { x: new Date("2023-06-03").getTime(), y: [134.5, 136.0, 133.5, 135.5] },
  { x: new Date("2023-06-04").getTime(), y: [135.0, 137.0, 134.0, 136.5] },
  { x: new Date("2023-06-05").getTime(), y: [136.0, 138.0, 135.0, 137.0] },
  { x: new Date("2023-06-06").getTime(), y: [137.0, 139.0, 136.0, 138.5] },
  { x: new Date("2023-06-07").getTime(), y: [138.5, 140.0, 137.5, 139.0] },
  { x: new Date("2023-06-08").getTime(), y: [139.0, 141.0, 138.0, 140.5] },
]

const marketSummary = {
  open: 132.5,
  high: 141.0,
  low: 131.5,
  close: 140.5,
  volume: 1530000,
}

const TradingChart = () => {
  const [coords, setCoords] = useState(null)
  const [trendlineInfo, setTrendlineInfo] = useState(null)
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 })
  const chartRef = useRef(null)
  const svgRef = useRef(null)

  const {
    trendlines,
    hoveredTrendline,
    drawingMode,
    pendingLine,
    activeDrag,
    setHoveredTrendline,
    handleChartClick,
    handleTrendlineDoubleClick,
    deleteTrendline,
    startDragging,
    handleDrag,
    endDragging,
  } = useTrendlines(chartDimensions, candleData, setTrendlineInfo)

  // Update chart dimensions when component mounts or window resizes
  useEffect(() => {
    const updateDimensions = () => {
      if (chartRef.current && chartRef.current.el) {
        const plotArea = chartRef.current.el.querySelector(".apexcharts-plot-area")
        if (plotArea) {
          const bbox = plotArea.getBoundingClientRect()
          setChartDimensions({
            width: bbox.width,
            height: bbox.height,
            left: bbox.left,
            top: bbox.top,
          })
        }
      }
    }

    // Initial update with delay to ensure chart is rendered
    setTimeout(updateDimensions, 500)

    // Update on resize
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  // Mouse event handlers for dragging
  const handleMouseMove = (e) => {
    if (!svgRef.current || !chartDimensions.width) return

    const rect = svgRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (activeDrag) {
      handleDrag(x, y)
    }
  }

  const handleMouseUp = () => {
    if (activeDrag) {
      endDragging()
    }
  }

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mousemove", handleMouseMove)

    return () => {
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mousemove", handleMouseMove)
    }
  }, [activeDrag])

  const options = {
    chart: {
      type: "candlestick",
      height: 400,
      id: "candles",
      events: {
        click: (event, chartContext, config) => {
          // Handle trendline drawing
          const rect = chartRef.current.el.getBoundingClientRect()
          const x = event.clientX - rect.left
          const y = event.clientY - rect.top
          handleChartClick(x, y)

          // Handle coordinate display for regular chart clicks
          if (config && chartContext && !drawingMode) {
            const xVal = chartContext.w.globals.seriesX[0][config.dataPointIndex]
            const yVal = config.y
            if (xVal && yVal !== undefined) {
              setCoords({
                timestamp: new Date(xVal).toLocaleString(),
                price: yVal.toFixed(2),
              })
            }
          }
        },
      },
      toolbar: { show: true },
      animations: { enabled: false },
    },
    xaxis: {
      type: "datetime",
      labels: { rotate: -45 },
    },
    yaxis: {
      tooltip: { enabled: true },
      forceNiceScale: true,
    },
    tooltip: {
      enabled: true,
      shared: true,
      custom: ({ seriesIndex, dataPointIndex, w }) => {
        const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex]
        const date = new Date(data.x).toLocaleDateString()
        const [open, high, low, close] = data.y

        return `
          <div class="apexcharts-tooltip-box p-2">
            <div><b>Date:</b> ${date}</div>
            <div><b>Open:</b> ${open}</div>
            <div><b>High:</b> ${high}</div>
            <div><b>Low:</b> ${low}</div>
            <div><b>Close:</b> ${close}</div>
          </div>
        `
      },
    },
  }

  const series = [{ data: candleData }]

  const getCoords = (x, y) => {
    if (!chartDimensions.width) return { xPx: 0, yPx: 0 }

    const xaxis = candleData.map((d) => d.x)
    const xMin = Math.min(...xaxis)
    const xMax = Math.max(...xaxis)

    const allY = candleData.flatMap((d) => d.y)
    const yMin = Math.min(...allY)
    const yMax = Math.max(...allY)

    const xPx = ((x - xMin) / (xMax - xMin)) * chartDimensions.width
    const yPx = chartDimensions.height - ((y - yMin) / (yMax - yMin)) * chartDimensions.height

    return { xPx, yPx }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 font-sans text-gray-800">
      {/* Market Summary */}
      <section className="bg-gray-100 rounded-lg p-4 mb-6 shadow-md">
        <h2 className="text-xl font-semibold text-blue-600 mb-2">Market Summary</h2>
        <ul className="flex flex-wrap gap-4">
          <li className="flex-1 min-w-[120px] bg-white rounded-md p-3 shadow-sm text-center font-medium">
            Open: <span className="font-bold">{marketSummary.open.toFixed(2)}</span>
          </li>
          <li className="flex-1 min-w-[120px] bg-white rounded-md p-3 shadow-sm text-center font-medium">
            High: <span className="font-bold">{marketSummary.high.toFixed(2)}</span>
          </li>
          <li className="flex-1 min-w-[120px] bg-white rounded-md p-3 shadow-sm text-center font-medium">
            Low: <span className="font-bold">{marketSummary.low.toFixed(2)}</span>
          </li>
          <li className="flex-1 min-w-[120px] bg-white rounded-md p-3 shadow-sm text-center font-medium">
            Close: <span className="font-bold">{marketSummary.close.toFixed(2)}</span>
          </li>
          <li className="flex-1 min-w-[120px] bg-white rounded-md p-3 shadow-sm text-center font-medium">
            Volume: <span className="font-bold">{marketSummary.volume.toLocaleString()}</span>
          </li>
        </ul>
      </section>

      {/* Drawing Mode Indicator */}
      {drawingMode && (
        <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 mb-4 text-blue-800">
          <p className="font-semibold">Drawing Mode Active</p>
          <p className="text-sm">Click on the chart to complete the trendline</p>
        </div>
      )}

      {/* Chart Container */}
      <div className="relative mb-6">
        <Chart options={options} series={series} type="candlestick" height={400} ref={chartRef} />

        {/* SVG overlay for trendlines */}
        <svg
          ref={svgRef}
          className="absolute top-0 left-0 w-full h-[400px] pointer-events-none"
          style={{ pointerEvents: "none" }}
        >
          {/* Pending line while drawing */}
          {pendingLine && (
            <line
              x1={getCoords(pendingLine.start.x, pendingLine.start.y).xPx}
              y1={getCoords(pendingLine.start.x, pendingLine.start.y).yPx}
              x2={getCoords(pendingLine.end.x, pendingLine.end.y).xPx}
              y2={getCoords(pendingLine.end.x, pendingLine.end.y).yPx}
              stroke="rgba(75, 192, 192, 0.7)"
              strokeWidth={2}
              strokeDasharray="5,5"
            />
          )}

          {/* Existing trendlines */}
          {trendlines.map((line) => {
            const startPos = getCoords(line.start.x, line.start.y)
            const endPos = getCoords(line.end.x, line.end.y)
            const midX = (startPos.xPx + endPos.xPx) / 2
            const midY = (startPos.yPx + endPos.yPx) / 2

            return (
              <g key={line.id} style={{ pointerEvents: "auto" }}>
                {/* Main trendline */}
                <line
                  x1={startPos.xPx}
                  y1={startPos.yPx}
                  x2={endPos.xPx}
                  y2={endPos.yPx}
                  stroke={line.color}
                  strokeWidth={2}
                  onDoubleClick={() => handleTrendlineDoubleClick(line)}
                  onMouseEnter={() => setHoveredTrendline(line.id)}
                  onMouseLeave={() => setHoveredTrendline(null)}
                  className="cursor-pointer"
                />

                {/* Start point handle */}
                <circle
                  cx={startPos.xPx}
                  cy={startPos.yPx}
                  r={hoveredTrendline === line.id ? 5 : 0}
                  fill="white"
                  stroke={line.color}
                  strokeWidth={2}
                  className="cursor-move"
                  onMouseDown={(e) => {
                    e.stopPropagation()
                    startDragging(line.id, "start", e.clientX, e.clientY)
                  }}
                />

                {/* End point handle */}
                <circle
                  cx={endPos.xPx}
                  cy={endPos.yPx}
                  r={hoveredTrendline === line.id ? 5 : 0}
                  fill="white"
                  stroke={line.color}
                  strokeWidth={2}
                  className="cursor-move"
                  onMouseDown={(e) => {
                    e.stopPropagation()
                    startDragging(line.id, "end", e.clientX, e.clientY)
                  }}
                />

                {/* Invisible line for easier dragging of entire line */}
                <line
                  x1={startPos.xPx}
                  y1={startPos.yPx}
                  x2={endPos.xPx}
                  y2={endPos.yPx}
                  stroke="transparent"
                  strokeWidth={10}
                  className="cursor-move"
                  onMouseDown={(e) => {
                    e.stopPropagation()
                    startDragging(line.id, "line", e.clientX, e.clientY)
                  }}
                />

                {/* Delete button on hover */}
                {hoveredTrendline === line.id && (
                  <foreignObject x={midX - 10} y={midY - 10} width={20} height={20} style={{ pointerEvents: "auto" }}>
                    <div
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteTrendline(line.id)
                      }}
                      title="Delete trendline"
                      className="cursor-pointer bg-white rounded-full w-5 h-5 flex items-center justify-center shadow-md text-red-600 font-bold select-none hover:bg-red-50"
                    >
                      &times;
                    </div>
                  </foreignObject>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-yellow-800">
        <p className="font-semibold mb-1">How to use:</p>
        <ul className="text-sm space-y-1">
          <li>• Click twice on the chart to draw a trendline</li>
          <li>• Double-click a trendline to view its coordinates</li>
          <li>• Drag trendlines or their endpoints to reposition</li>
          <li>• Hover over a trendline to see the delete button</li>
        </ul>
      </div>

      {/* Trendline Information */}
      {trendlineInfo && (
        <section className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 shadow-md">
          <h2 className="text-lg font-semibold text-green-700 mb-2">Trendline Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Start Point:</p>
              <p className="text-sm">Date: {new Date(trendlineInfo.start.x).toLocaleDateString()}</p>
              <p className="text-sm">Price: ${trendlineInfo.start.y.toFixed(2)}</p>
            </div>
            <div>
              <p className="font-semibold">End Point:</p>
              <p className="text-sm">Date: {new Date(trendlineInfo.end.x).toLocaleDateString()}</p>
              <p className="text-sm">Price: ${trendlineInfo.end.y.toFixed(2)}</p>
            </div>
          </div>
          <div className="mt-2">
            <p className="font-semibold">
              Slope: <span className="font-normal">{trendlineInfo.slope.toFixed(4)}</span>
            </p>
          </div>
        </section>
      )}

      {/* Coordinates Display */}
      <section className="bg-gray-50 rounded-lg p-4 shadow-md">
        <h2 className="text-lg font-semibold text-blue-700 mb-2">Chart Coordinates</h2>
        {coords ? (
          <>
            <p>
              <span className="font-semibold">Timestamp:</span> {coords.timestamp}
            </p>
            <p>
              <span className="font-semibold">Price:</span> ${coords.price}
            </p>
          </>
        ) : (
          <p className="text-gray-500">Click on the chart to get coordinates.</p>
        )}
      </section>

      {/* Trendlines Summary */}
      {trendlines.length > 0 && (
        <section className="bg-gray-50 rounded-lg p-4 mt-4 shadow-md">
          <h2 className="text-lg font-semibold text-blue-700 mb-2">Active Trendlines ({trendlines.length})</h2>
          <div className="space-y-2">
            {trendlines.map((line, index) => (
              <div key={line.id} className="flex items-center justify-between bg-white p-2 rounded border">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: line.color }}></div>
                  <span className="text-sm font-medium">Trendline {index + 1}</span>
                </div>
                <button
                  onClick={() => deleteTrendline(line.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default TradingChart
