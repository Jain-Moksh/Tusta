"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Chart from "react-apexcharts"
import { Trash } from "lucide-react"

const fetchStockData = async () => {
  try {
    const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=ETHUSDT&interval=1d&limit=100`)

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const rawData = await response.json()
    console.log("Raw API Response:", rawData)

    // Binance returns array-based OHLC data
    const formattedData = rawData.map((item) => ({
      date: new Date(item[0]).toISOString().split("T")[0], // timestamp in ms
      open: Number.parseFloat(item[1]),
      high: Number.parseFloat(item[2]),
      low: Number.parseFloat(item[3]),
      close: Number.parseFloat(item[4]),
    }))

    console.log("Formatted Data:", formattedData)
    return formattedData
  } catch (error) {
    console.error("Error fetching crypto data:", error)
    throw error
  }
}

const getRandomColor = () => {
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#84cc16"]
  return colors[Math.floor(Math.random() * colors.length)]
}

const TradingChart = () => {
  const [candleData, setCandleData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [coords, setCoords] = useState(null)
  const [trendlineInfo, setTrendlineInfo] = useState(null)
  const [trendlines, setTrendlines] = useState([])
  const [hoveredTrendlineId, setHoveredTrendlineId] = useState(null)
  const [selectedTrendlineId, setSelectedTrendlineId] = useState(null)
  const [drawingMode, setDrawingMode] = useState(false)
  const [chartReady, setChartReady] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 })

  // Drawing state
  const [drawingState, setDrawingState] = useState({
    isDrawing: false,
    startPoint: null,
  })

  // Dragging state
  const [dragState, setDragState] = useState({
    isDragging: false,
    trendlineId: null,
    dragType: null, // "start", "end", or "line"
    startPos: null,
    originalTrendline: null,
  })

  const chartRef = useRef(null)
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  // Chart configuration
  const margin = { top: 20, right: 60, bottom: 40, left: 60 }
  const chartWidth = dimensions.width - margin.left - margin.right
  const chartHeight = dimensions.height - margin.top - margin.bottom

  // Generate ID for trendlines
  const generateId = () => `trendline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchStockData()

        // Convert to ApexCharts format
        const formattedData = data.map((item) => ({
          x: new Date(item.date).getTime(),
          y: [item.open, item.high, item.low, item.close],
        }))

        setCandleData(formattedData)
      } catch (err) {
        setError("Failed to fetch crypto data")
        console.error("Error loading data:", err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Load trendlines from localStorage on mount
  useEffect(() => {
    try {
      const savedTrendlines = localStorage.getItem("trading-chart-trendlines")
      if (savedTrendlines) {
        setTrendlines(JSON.parse(savedTrendlines))
      }
    } catch (error) {
      console.error("Error loading trendlines from localStorage:", error)
    }
  }, [])

  // Save trendlines to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem("trading-chart-trendlines", JSON.stringify(trendlines))
    } catch (error) {
      console.error("Error saving trendlines to localStorage:", error)
    }
  }, [trendlines])

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setDimensions({ width: rect.width, height: 400 })
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Create scales
  const getTimeScale = useCallback(() => {
    if (candleData.length === 0) return { min: 0, max: 1, scale: (t) => 0 }

    const minTime = Math.min(...candleData.map((d) => d.x))
    const maxTime = Math.max(...candleData.map((d) => d.x))
    const timeRange = maxTime - minTime

    return {
      min: minTime,
      max: maxTime,
      scale: (time) => ((time - minTime) / timeRange) * chartWidth,
    }
  }, [chartWidth, candleData])

  const getPriceScale = useCallback(() => {
    if (candleData.length === 0) return { min: 0, max: 1, scale: (p) => 0, invert: (y) => 0 }

    const prices = candleData.flatMap((d) => d.y)
    const minPrice = Math.min(...prices) * 0.99
    const maxPrice = Math.max(...prices) * 1.01
    const priceRange = maxPrice - minPrice

    return {
      min: minPrice,
      max: maxPrice,
      scale: (price) => chartHeight - ((price - minPrice) / priceRange) * chartHeight,
      invert: (y) => minPrice + ((chartHeight - y) / chartHeight) * priceRange,
    }
  }, [chartHeight, candleData])

  // Convert screen coordinates to chart coordinates
  const screenToChart = useCallback(
    (x, y) => {
      const timeScale = getTimeScale()
      const priceScale = getPriceScale()

      const chartX = x - margin.left
      const chartY = y - margin.top

      if (chartX < 0 || chartX > chartWidth || chartY < 0 || chartY > chartHeight) {
        return null
      }

      const time = timeScale.min + (chartX / chartWidth) * (timeScale.max - timeScale.min)
      const price = priceScale.invert(chartY)

      return { time, price }
    },
    [getTimeScale, getPriceScale, margin, chartWidth, chartHeight],
  )

  // Convert chart coordinates to screen coordinates
  const chartToScreen = useCallback(
    (point) => {
      const timeScale = getTimeScale()
      const priceScale = getPriceScale()

      const x = timeScale.scale(point.time) + margin.left
      const y = priceScale.scale(point.price) + margin.top

      return { x, y }
    },
    [getTimeScale, getPriceScale, margin],
  )

  // Distance from point to line
  const distanceToLine = (px, py, x1, y1, x2, y2) => {
    const A = px - x1
    const B = py - y1
    const C = x2 - x1
    const D = y2 - y1

    const dot = A * C + B * D
    const lenSq = C * C + D * D

    if (lenSq === 0) return Math.sqrt(A * A + B * B)

    let param = dot / lenSq
    param = Math.max(0, Math.min(1, param))

    const xx = x1 + param * C
    const yy = y1 + param * D

    const dx = px - xx
    const dy = py - yy

    return Math.sqrt(dx * dx + dy * dy)
  }

  // Distance from point to point
  const distanceToPoint = (px, py, x, y) => {
    return Math.sqrt((px - x) ** 2 + (py - y) ** 2)
  }

  // Order points by time
  const orderByTime = (a, b) => {
    return a.time <= b.time ? [a, b] : [b, a]
  }

  // Draw the chart and trendlines
  const drawChart = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !chartReady || candleData.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = dimensions.width * window.devicePixelRatio
    canvas.height = dimensions.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height)

    // Draw trendlines
    trendlines.forEach((trendline) => {
      const start = chartToScreen({ time: trendline.startPoint.time, price: trendline.startPoint.price })
      const end = chartToScreen({ time: trendline.endPoint.time, price: trendline.endPoint.price })

      if (start && end) {
        const isSelected = trendline.id === selectedTrendlineId
        const isHovered = trendline.id === hoveredTrendlineId
        const isDragging = dragState.isDragging && dragState.trendlineId === trendline.id

        // Draw main line
        ctx.strokeStyle = trendline.color
        ctx.lineWidth = isSelected || isHovered || isDragging ? 3 : 2
        ctx.beginPath()
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(end.x, end.y)
        ctx.stroke()

        // Draw control points when hovered, selected, or dragging
        if (isHovered || isSelected || isDragging) {
          ctx.fillStyle = trendline.color
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 2

          // Start point
          ctx.beginPath()
          ctx.arc(start.x, start.y, 6, 0, 2 * Math.PI)
          ctx.fill()
          ctx.stroke()

          // End point
          ctx.beginPath()
          ctx.arc(end.x, end.y, 6, 0, 2 * Math.PI)
          ctx.fill()
          ctx.stroke()

          // Draw trendline ID label
          const midX = (start.x + end.x) / 2
          const midY = (start.y + end.y) / 2
          ctx.fillStyle = "#ffffff"
          ctx.font = "10px sans-serif"
          ctx.fillText(`#${trendline.id.slice(-4)}`, midX + 10, midY - 10)
        }
      }
    })

    // Draw drawing preview
    if (drawingState.isDrawing && drawingState.startPoint) {
      const start = chartToScreen(drawingState.startPoint)
      if (start) {
        ctx.fillStyle = "#3b82f6"
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(start.x, start.y, 6, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
      }
    }
  }, [
    dimensions,
    chartReady,
    candleData,
    trendlines,
    selectedTrendlineId,
    hoveredTrendlineId,
    dragState,
    drawingState,
    chartToScreen,
  ])

  // Draw chart when dependencies change
  useEffect(() => {
    drawChart()
  }, [drawChart])

  // Log coordinates function
  const logCoordinates = useCallback((trendline, action) => {
    const startDate = new Date(trendline.startPoint.time)
    const endDate = new Date(trendline.endPoint.time)

    const coordinateData = {
      id: trendline.id,
      action: action,
      startPoint: {
        timestamp: startDate.toLocaleString(),
        price: `$${trendline.startPoint.price.toFixed(2)}`,
      },
      endPoint: {
        timestamp: endDate.toLocaleString(),
        price: `$${trendline.endPoint.price.toFixed(2)}`,
      },
      priceChange: `$${(trendline.endPoint.price - trendline.startPoint.price).toFixed(2)}`,
      direction: trendline.endPoint.price > trendline.startPoint.price ? "Bullish" : "Bearish",
    }

    console.log(`📊 Trendline ${action}:`, coordinateData)

    // Update trendline info for display
    setTrendlineInfo({
      start: { x: trendline.startPoint.time, y: trendline.startPoint.price },
      end: { x: trendline.endPoint.time, y: trendline.endPoint.price },
    })
  }, [])

  // Handle canvas click
  const handleCanvasClick = useCallback(
    (event) => {
      if (!chartReady || candleData.length === 0) return

      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      if (drawingMode) {
        const chartPoint = screenToChart(x, y)
        if (!chartPoint) return

        if (!drawingState.isDrawing) {
          // Start drawing
          setDrawingState({
            isDrawing: true,
            startPoint: chartPoint,
          })
        } else if (drawingState.startPoint) {
          // Finish drawing
          const [start, end] = orderByTime(drawingState.startPoint, chartPoint)

          const newTrendline = {
            id: generateId(),
            startPoint: { time: start.time, price: start.price },
            endPoint: { time: end.time, price: end.price },
            color: getRandomColor(),
            width: 2,
          }

          setTrendlines((prev) => [...prev, newTrendline])
          setSelectedTrendlineId(newTrendline.id)
          logCoordinates(newTrendline, "Created")

          setDrawingState({
            isDrawing: false,
            startPoint: null,
          })
        }
      } else {
        // Handle selection in non-drawing mode
        let clickedTrendline = null

        // Check if we clicked on a trendline
        for (const trendline of trendlines) {
          const start = chartToScreen({ time: trendline.startPoint.time, price: trendline.startPoint.price })
          const end = chartToScreen({ time: trendline.endPoint.time, price: trendline.endPoint.price })

          if (start && end) {
            const distance = distanceToLine(x, y, start.x, start.y, end.x, end.y)
            if (distance <= 8) {
              clickedTrendline = trendline.id
              break
            }
          }
        }

        if (clickedTrendline) {
          const trendline = trendlines.find((t) => t.id === clickedTrendline)
          if (trendline) {
            setSelectedTrendlineId(clickedTrendline)
            logCoordinates(trendline, "Selected")
          }
        } else {
          setSelectedTrendlineId(null)
        }
      }
    },
    [chartReady, candleData, drawingMode, drawingState, screenToChart, chartToScreen, trendlines, logCoordinates],
  )

  // Handle mouse move for hover detection and dragging
  const handleCanvasMouseMove = useCallback(
    (event) => {
      if (!chartReady || candleData.length === 0) return

      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      if (dragState.isDragging && dragState.trendlineId && dragState.startPos) {
        // Handle dragging
        const dx = x - dragState.startPos.x
        const dy = y - dragState.startPos.y

        const trendline = trendlines.find((t) => t.id === dragState.trendlineId)
        if (!trendline) return

        let updatedTrendline = { ...trendline }

        if (dragState.dragType === "start") {
          const newPoint = screenToChart(x, y)
          if (newPoint) {
            const [start, end] = orderByTime(newPoint, trendline.endPoint)
            updatedTrendline = {
              ...trendline,
              startPoint: { time: start.time, price: start.price },
              endPoint: { time: end.time, price: end.price },
            }
          }
        } else if (dragState.dragType === "end") {
          const newPoint = screenToChart(x, y)
          if (newPoint) {
            const [start, end] = orderByTime(trendline.startPoint, newPoint)
            updatedTrendline = {
              ...trendline,
              startPoint: { time: start.time, price: start.price },
              endPoint: { time: end.time, price: end.price },
            }
          }
        } else if (dragState.dragType === "line") {
          // Move entire line
          const originalStart = chartToScreen({
            time: dragState.originalTrendline.startPoint.time,
            price: dragState.originalTrendline.startPoint.price,
          })
          const originalEnd = chartToScreen({
            time: dragState.originalTrendline.endPoint.time,
            price: dragState.originalTrendline.endPoint.price,
          })

          if (originalStart && originalEnd) {
            const newStart = screenToChart(originalStart.x + dx, originalStart.y + dy)
            const newEnd = screenToChart(originalEnd.x + dx, originalEnd.y + dy)

            if (newStart && newEnd) {
              const [start, end] = orderByTime(newStart, newEnd)
              updatedTrendline = {
                ...trendline,
                startPoint: { time: start.time, price: start.price },
                endPoint: { time: end.time, price: end.price },
              }
            }
          }
        }

        setTrendlines((prev) => prev.map((t) => (t.id === dragState.trendlineId ? updatedTrendline : t)))
      } else if (!drawingMode && !dragState.isDragging) {
        // Handle hover detection
        let hoveredId = null
        let cursor = "default"

        for (const trendline of trendlines) {
          const start = chartToScreen({ time: trendline.startPoint.time, price: trendline.startPoint.price })
          const end = chartToScreen({ time: trendline.endPoint.time, price: trendline.endPoint.price })

          if (start && end) {
            const startDist = distanceToPoint(x, y, start.x, start.y)
            const endDist = distanceToPoint(x, y, end.x, end.y)
            const lineDist = distanceToLine(x, y, start.x, start.y, end.x, end.y)

            if (startDist <= 10) {
              hoveredId = trendline.id
              cursor = "grab"
              break
            } else if (endDist <= 10) {
              hoveredId = trendline.id
              cursor = "grab"
              break
            } else if (lineDist <= 8) {
              hoveredId = trendline.id
              cursor = "move"
              break
            }
          }
        }

        setHoveredTrendlineId(hoveredId)

        // Update cursor
        if (canvasRef.current) {
          canvasRef.current.style.cursor = drawingMode ? "crosshair" : cursor
        }
      }
    },
    [chartReady, candleData, dragState, drawingMode, trendlines, chartToScreen, screenToChart],
  )

  // Handle mouse down for dragging
  const handleMouseDown = useCallback(
    (event) => {
      if (!chartReady || drawingMode || candleData.length === 0) return

      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      // Check if we're clicking on a trendline or its control points
      for (const trendline of trendlines) {
        const start = chartToScreen({ time: trendline.startPoint.time, price: trendline.startPoint.price })
        const end = chartToScreen({ time: trendline.endPoint.time, price: trendline.endPoint.price })

        if (start && end) {
          const startDist = distanceToPoint(x, y, start.x, start.y)
          const endDist = distanceToPoint(x, y, end.x, end.y)
          const lineDist = distanceToLine(x, y, start.x, start.y, end.x, end.y)

          if (startDist <= 10) {
            // Dragging start point
            event.preventDefault()
            setDragState({
              isDragging: true,
              trendlineId: trendline.id,
              dragType: "start",
              startPos: { x, y },
              originalTrendline: { ...trendline },
            })
            setSelectedTrendlineId(trendline.id)
            return
          } else if (endDist <= 10) {
            // Dragging end point
            event.preventDefault()
            setDragState({
              isDragging: true,
              trendlineId: trendline.id,
              dragType: "end",
              startPos: { x, y },
              originalTrendline: { ...trendline },
            })
            setSelectedTrendlineId(trendline.id)
            return
          } else if (lineDist <= 8) {
            // Dragging entire line
            event.preventDefault()
            setDragState({
              isDragging: true,
              trendlineId: trendline.id,
              dragType: "line",
              startPos: { x, y },
              originalTrendline: { ...trendline },
            })
            setSelectedTrendlineId(trendline.id)
            return
          }
        }
      }
    },
    [chartReady, candleData, drawingMode, trendlines, chartToScreen],
  )

  // Handle mouse up for dragging
  const handleMouseUp = useCallback(() => {
    if (dragState.isDragging && dragState.trendlineId) {
      const trendline = trendlines.find((t) => t.id === dragState.trendlineId)
      if (trendline) {
        logCoordinates(trendline, "Dragged")
      }
    }

    setDragState({
      isDragging: false,
      trendlineId: null,
      dragType: null,
      startPos: null,
      originalTrendline: null,
    })
  }, [dragState, trendlines, logCoordinates])

  // Handle double click for coordinate logging
  const handleDoubleClick = useCallback(
    (event) => {
      if (drawingMode || dragState.isDragging || candleData.length === 0) return

      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      // Check if we double-clicked on a trendline
      for (const trendline of trendlines) {
        const start = chartToScreen({ time: trendline.startPoint.time, price: trendline.startPoint.price })
        const end = chartToScreen({ time: trendline.endPoint.time, price: trendline.endPoint.price })

        if (start && end) {
          const distance = distanceToLine(x, y, start.x, start.y, end.x, end.y)
          if (distance <= 8) {
            logCoordinates(trendline, "Double-clicked")
            setSelectedTrendlineId(trendline.id)
            return
          }
        }
      }
    },
    [drawingMode, candleData, dragState.isDragging, trendlines, chartToScreen, logCoordinates],
  )

  // Delete a trendline
  const deleteTrendline = useCallback(
    (id) => {
      const trendline = trendlines.find((t) => t.id === id)
      if (trendline) {
        logCoordinates(trendline, "Deleted")
      }

      setTrendlines((prev) => prev.filter((line) => line.id !== id))
      setHoveredTrendlineId(null)

      if (selectedTrendlineId === id) {
        setSelectedTrendlineId(null)
        setTrendlineInfo(null)
      }
    },
    [trendlines, selectedTrendlineId, logCoordinates],
  )

  // Toggle drawing mode
  const toggleDrawingMode = () => {
    setDrawingMode(!drawingMode)
    setDrawingState({
      isDrawing: false,
      startPoint: null,
    })
  }

  // Clear all trendlines
  const clearAllTrendlines = () => {
    setTrendlines([])
    setSelectedTrendlineId(null)
    setHoveredTrendlineId(null)
    setTrendlineInfo(null)
  }

  // Add global mouse up and mouse move listeners for dragging
  useEffect(() => {
    const handleGlobalMouseMove = (event) => {
      if (dragState.isDragging) {
        handleCanvasMouseMove(event)
      }
    }

    const handleGlobalMouseUp = () => {
      if (dragState.isDragging) {
        handleMouseUp()
      }
    }

    if (dragState.isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove)
      document.addEventListener("mouseup", handleGlobalMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove)
      document.removeEventListener("mouseup", handleGlobalMouseUp)
    }
  }, [dragState.isDragging, handleCanvasMouseMove, handleMouseUp])

  // Loading state
  if (loading) {
    return (
      <div className="w-full h-full bg-gray-900 rounded-lg p-4 flex items-center justify-center">
        <p className="text-white">Loading chart data...</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="w-full h-full bg-gray-900 rounded-lg p-4 flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  // No data state
  if (!candleData || candleData.length === 0) {
    return (
      <div className="w-full h-full bg-gray-900 rounded-lg p-4 flex items-center justify-center">
        <p className="text-yellow-500">No data available to display</p>
      </div>
    )
  }

  const options = {
    chart: {
      type: "candlestick",
      height: 400,
      id: "candles",
      events: {
        mounted: () => {
          console.log("Chart mounted")
          setTimeout(() => {
            setChartReady(true)
          }, 1000)
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
    },
  }

  const series = [{ data: candleData }]

  return (
    <div className="w-full h-full bg-gray-900 rounded-lg p-4">
      {/* Controls */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-4 lg:space-x-3 xl:space-x-4">
          <button
            onClick={toggleDrawingMode}
            className="px-3 py-1.5 lg:px-2 lg:py-1 xl:px-3 xl:py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs md:text-sm lg:text-sm xl:text-base"
          >
            {drawingMode ? "Drawing OFF" : "Drawing ON"}
          </button>
          {trendlines.length > 0 && (
            <button
              onClick={clearAllTrendlines}
              className="px-3 py-1.5 lg:px-2 lg:py-1 xl:px-3 xl:py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-xs md:text-sm lg:text-sm xl:text-base"
            >
              Clear All ({trendlines.length})
            </button>
          )}
        </div>
      </div>

      {/* Chart Container */}
      <div ref={containerRef} className="relative mb-6">
        <Chart options={options} series={series} type="candlestick" height={400} ref={chartRef} />

        {/* Canvas overlay for trendlines */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-auto"
          style={{ height: "400px" }}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
        />

        {/* Delete button for hovered trendline */}
        {hoveredTrendlineId &&
          !drawingMode &&
          !dragState.isDragging &&
          (() => {
            const line = trendlines.find((t) => t.id === hoveredTrendlineId)
            if (!line) return null

            const start = chartToScreen({ time: line.startPoint.time, price: line.startPoint.price })
            const end = chartToScreen({ time: line.endPoint.time, price: line.endPoint.price })
            if (!start || !end) return null

            const midX = (start.x + end.x) / 2
            const midY = (start.y + end.y) / 2

            return (
              <div className="absolute z-20" style={{ left: `${midX - 12}px`, top: `${midY - 12}px` }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteTrendline(hoveredTrendlineId)
                  }}
                  className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-600 shadow-lg"
                  title="Delete trendline"
                >
                  <Trash className="h-3 w-3" />
                </button>
              </div>
            )
          })()}
      </div>

      {/* Trendline Coordinates - Visible when no trendlines exist */}
      {trendlines.length === 0 && (
        <div className="hidden lg:block bg-gray-800/50 rounded-lg p-4 mt-4 lg:p-3 lg:mt-3 xl:p-4 xl:mt-4">
          <div className="flex justify-between mb-3 lg:mb-2 xl:mb-3">
            <span className="text-gray-400 text-base lg:text-sm xl:text-base">Trendline Coordinates</span>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:gap-2 xl:gap-3">
            <div className="bg-gray-900/50 rounded-lg p-3 lg:p-2 xl:p-3">
              <div className="text-sm lg:text-xs xl:text-sm text-gray-400 mb-1">Start Coordinates</div>
              <div className="text-lg lg:text-base xl:text-lg text-white">No trendline created</div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-3 lg:p-2 xl:p-3">
              <div className="text-sm lg:text-xs xl:text-sm text-gray-400 mb-1">End Coordinates</div>
              <div className="text-lg lg:text-base xl:text-lg text-white">No trendline created</div>
            </div>
          </div>
        </div>
      )}

      {/* Trendlines Summary - Visible when trendlines exist */}
      {trendlines.length > 0 && (
        <div className="bg-gray-800/50 rounded-lg p-4 mt-4 lg:p-3 lg:mt-3 xl:p-4 xl:mt-4">
          <h2 className="text-lg lg:text-base xl:text-lg text-gray-400 mb-3 lg:mb-2 xl:mb-3">
            Active Trendlines ({trendlines.length})
          </h2>
          <div className="space-y-2">
            {trendlines.map((line, index) => (
              <div
                key={line.id}
                className={`flex items-center justify-between bg-gray-900/50 p-3 lg:p-2 xl:p-3 rounded border cursor-pointer transition-colors ${
                  selectedTrendlineId === line.id
                    ? "border-blue-500 bg-blue-900/30"
                    : "border-gray-700 hover:border-gray-600"
                }`}
                onClick={() => {
                  setSelectedTrendlineId(line.id)
                  logCoordinates(line, "Selected")
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: line.color }}></div>
                  <div>
                    <span className="text-sm lg:text-xs xl:text-sm font-medium text-white">Trendline {index + 1}</span>
                    <div className="text-xs lg:text-[10px] xl:text-xs text-gray-400">
                      Start: {new Date(line.startPoint.time).toLocaleDateString()} - ${line.startPoint.price.toFixed(2)}
                    </div>
                    <div className="text-xs lg:text-[10px] xl:text-xs text-gray-400">
                      End: {new Date(line.endPoint.time).toLocaleDateString()} - ${line.endPoint.price.toFixed(2)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteTrendline(line.id)
                  }}
                  className="text-red-400 hover:text-red-300 text-sm font-medium px-2 py-1 rounded hover:bg-red-900/30 transition-colors"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TradingChart
