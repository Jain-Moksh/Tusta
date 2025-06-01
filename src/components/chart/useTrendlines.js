"use client"

import { useState, useEffect, useCallback } from "react"

// Generate a random color for trendlines
const getRandomColor = () => {
  const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#8AC926",
    "#1982C4",
    "#6A4C93",
    "#FF595E",
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

const useTrendlines = (chartDimensions, candleData, setTrendlineInfo, clearCoords) => {
  // State for trendlines
  const [trendlines, setTrendlines] = useState([])
  const [hoveredTrendline, setHoveredTrendline] = useState(null)
  const [drawingMode, setDrawingMode] = useState(false)
  const [pendingLine, setPendingLine] = useState(null)
  const [activeDrag, setActiveDrag] = useState(null)

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

  // Convert pixel coords to data coords
  const getDataCoords = useCallback(
    (xPx, yPx) => {
      if (!chartDimensions.width || !candleData.length) return { x: 0, y: 0 }

      const xaxis = candleData.map((d) => d.x)
      const xMin = Math.min(...xaxis)
      const xMax = Math.max(...xaxis)

      const allY = candleData.flatMap((d) => d.y)
      const yMin = Math.min(...allY)
      const yMax = Math.max(...allY)

      const x = xMin + (xPx / chartDimensions.width) * (xMax - xMin)
      const y = yMin + ((chartDimensions.height - yPx) / chartDimensions.height) * (yMax - yMin)

      return { x, y }
    },
    [chartDimensions, candleData],
  )

  // Handle chart click for drawing trendlines
  const handleChartClick = useCallback(
    (xPx, yPx) => {
      if (!chartDimensions.width) return

      const dataCoords = getDataCoords(xPx, yPx)

      if (!drawingMode) {
        // Start drawing a new trendline
        setPendingLine({
          start: dataCoords,
          end: dataCoords,
        })
        setDrawingMode(true)
        if (clearCoords) clearCoords()
        console.log("Started drawing trendline at:", {
          timestamp: new Date(dataCoords.x).toISOString(),
          price: dataCoords.y,
        })
      } else {
        // Finish drawing the trendline
        const newTrendline = {
          id: Date.now().toString(),
          start: pendingLine.start,
          end: dataCoords,
          color: getRandomColor(),
        }

        setTrendlines((prev) => [...prev, newTrendline])
        setPendingLine(null)
        setDrawingMode(false)

        // Log the coordinates
        console.log("New trendline created:", {
          start: {
            timestamp: new Date(newTrendline.start.x).toISOString(),
            price: newTrendline.start.y,
          },
          end: {
            timestamp: new Date(newTrendline.end.x).toISOString(),
            price: newTrendline.end.y,
          },
        })
      }
    },
    [drawingMode, pendingLine, chartDimensions, getDataCoords, clearCoords],
  )

  // Handle double-click on trendline to display coordinates
  const handleTrendlineDoubleClick = useCallback(
    (line) => {
      const slope = (line.end.y - line.start.y) / (line.end.x - line.start.x)

      // Display coordinates
      setTrendlineInfo({
        start: line.start,
        end: line.end,
        slope: slope,
      })

      // Log coordinates
      console.log("Trendline coordinates:", {
        start: {
          timestamp: new Date(line.start.x).toISOString(),
          price: line.start.y,
        },
        end: {
          timestamp: new Date(line.end.x).toISOString(),
          price: line.end.y,
        },
        slope: slope,
      })
    },
    [setTrendlineInfo],
  )

  // Delete a trendline
  const deleteTrendline = useCallback(
    (id) => {
      setTrendlines((prev) => prev.filter((line) => line.id !== id))
      setHoveredTrendline(null)
      if (setTrendlineInfo) setTrendlineInfo(null)
      console.log("Trendline deleted:", id)
    },
    [setTrendlineInfo],
  )

  // Start dragging a trendline or its endpoints
  const startDragging = useCallback(
    (id, part, clientX, clientY) => {
      const originalLine = trendlines.find((line) => line.id === id)
      if (!originalLine) return

      setActiveDrag({
        id,
        part, // 'start', 'end', or 'line'
        startX: clientX,
        startY: clientY,
        originalLine: { ...originalLine },
      })
    },
    [trendlines],
  )

  // Handle dragging
  const handleDrag = useCallback(
    (xPx, yPx) => {
      if (!activeDrag || !chartDimensions.width) return

      const dataCoords = getDataCoords(xPx, yPx)

      setTrendlines((prev) =>
        prev.map((line) => {
          if (line.id !== activeDrag.id) return line

          const original = activeDrag.originalLine

          if (activeDrag.part === "start") {
            return { ...line, start: dataCoords }
          } else if (activeDrag.part === "end") {
            return { ...line, end: dataCoords }
          } else if (activeDrag.part === "line") {
            // Calculate the delta from the original click position
            const originalClickCoords = getDataCoords(
              activeDrag.startX - chartDimensions.left,
              activeDrag.startY - chartDimensions.top,
            )

            const deltaX = dataCoords.x - originalClickCoords.x
            const deltaY = dataCoords.y - originalClickCoords.y

            return {
              ...line,
              start: {
                x: original.start.x + deltaX,
                y: original.start.y + deltaY,
              },
              end: {
                x: original.end.x + deltaX,
                y: original.end.y + deltaY,
              },
            }
          }

          return line
        }),
      )
    },
    [activeDrag, chartDimensions, getDataCoords],
  )

  // End dragging
  const endDragging = useCallback(() => {
    if (!activeDrag) return

    const updatedLine = trendlines.find((line) => line.id === activeDrag.id)
    if (updatedLine) {
      // Log the updated coordinates
      console.log("Trendline updated:", {
        start: {
          timestamp: new Date(updatedLine.start.x).toISOString(),
          price: updatedLine.start.y,
        },
        end: {
          timestamp: new Date(updatedLine.end.x).toISOString(),
          price: updatedLine.end.y,
        },
      })

      // Update the trendline info if it's currently displayed
      if (setTrendlineInfo) {
        const slope = (updatedLine.end.y - updatedLine.start.y) / (updatedLine.end.x - updatedLine.start.x)
        setTrendlineInfo({
          start: updatedLine.start,
          end: updatedLine.end,
          slope: slope,
        })
      }
    }

    setActiveDrag(null)
  }, [activeDrag, trendlines, setTrendlineInfo])

  return {
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
  }
}

export default useTrendlines
