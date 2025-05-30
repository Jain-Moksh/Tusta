export const candleStickOptions = {
    chart: {
        type: 'candlestick',
        height: 500,
        background: '#1a1a1a',
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
        }
    },
    grid: {
        borderColor: '#2B2B43',
        strokeDashArray: 0
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
            color: '#2B2B43'
        },
        axisTicks: {
            color: '#2B2B43'
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