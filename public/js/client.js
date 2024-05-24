// public/client.js

const socket = io();

const ctx = document.getElementById('dynamic-chart').getContext('2d');
const dynamicChart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [{
            label: 'Dynamic Chart',
            borderColor: 'green',
            borderWidth: 2,
            data: [] // Initial empty data
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    fontColor: 'white'
                }
            }],
            xAxes: [{
                type: 'realtime', // Use 'realtime' scale for dynamic updates
                realtime: {
                    duration: 20000, // Display duration (milliseconds)
                    refresh: 1000, // Refresh interval (milliseconds)
                    delay: 2000 // Delay before displaying new data (milliseconds)
                }
            }]
        }
    }
});

// Listen for initial chart data from the server
socket.on('initialChartData', (data) => {
    console.log('Initial chart data received:', data);
    // Update chart with initial data
    dynamicChart.data.datasets[0].data = data;
    dynamicChart.update();
});

// Listen for chart data updates from the server
socket.on('chartDataUpdate', (data) => {
    console.log('Chart data update received:', data);
    // Update chart with new data
    dynamicChart.data.datasets[0].data = data;
    dynamicChart.update();
});
