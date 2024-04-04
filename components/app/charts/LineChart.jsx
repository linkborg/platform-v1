import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { startOfToday, subDays, isWithinInterval } from 'date-fns';
Chart.register(...registerables);

const LineChart = ({ chartData, label, type="views", range="month" }) => {

    // Sort the data in ascending order of date
    chartData.sort((a, b) => new Date(a.value) - new Date(b.value));

    // Filter the data based on the selected range
    let filteredData = chartData;
    const today = startOfToday();
    if (range === "week") {
        const sevenDaysAgo = subDays(today, 7);
        filteredData = chartData.filter(item => isWithinInterval(new Date(item.value), { start: sevenDaysAgo, end: today }));
    } else if (range === "today") {
        filteredData = chartData.filter(item => isWithinInterval(new Date(item.value), { start: today, end: today }));
    }

    // Prepare the labels (dates) and the data (view counts)
    const labels = filteredData.map(item => item.value);
    let datasetsData = filteredData.map(item => item.count);

    if (type==="durations") {
        datasetsData = filteredData.map(item => Math.round(item.count / 1000));
    }

    const finalData = {
        labels: labels,
        datasets: [
            {
                label: label,
                data: datasetsData,
                fill: false,
                borderColor: 'rgba(75,192,192,1)', // for example
                tension: 0.1 // this gives the line chart a bit of curve
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return <Line data={finalData} options={options} />;
};

export default LineChart;
