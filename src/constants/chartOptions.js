export const candleStickOptions = {
    chart: {
        type: 'candlestick',
        height: 500,
        background: '#0B1221',
        foreColor: '#d1d4dc',
        animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
        },
        toolbar: {
            show: true,
            tools: {
                download: false,
                selection: true,
                zoom: true,
                zoomin: true,
                zoomout: true,
                pan: true,
                reset: true
            },
            autoSelected: 'zoom'
        },
        margin: {
            top: 30,
            right: 1,
            bottom: 0,
            left: 1
        }
    },
    grid: {
        borderColor: '#1C2537',
        strokeDashArray: 0,
        padding: {
            top: 20,
            right: 5,
            bottom: 20,
            left: 5
        }
    },
    plotOptions: {
        candlestick: {
            colors: {
                upward: '#26a69a',
                downward: '#ef5350'
            },
            wick: {
                useFillColor: true,
            }
        }
    },
    xaxis: {
        type: 'datetime',
        labels: {
            style: {
                colors: '#d1d4dc'
            }
        },
        axisBorder: {
            color: '#1C2537'
        },
        axisTicks: {
            color: '#1C2537'
        }
    },
    yaxis: {
        tooltip: {
            enabled: true
        },
        labels: {
            style: {
                colors: '#d1d4dc'
            }
        }
    },
    tooltip: {
        theme: 'dark'
    }
}; 