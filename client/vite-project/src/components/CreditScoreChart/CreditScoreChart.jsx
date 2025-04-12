import React from "react";
import { Line } from 'react-chartjs-2';

const CreditScoreChart = ({ data }) => {
    const chartData = {
        labels: data.map(d => d.time), // Time axis
        datasets: [
            {
                label: 'Public Trust Score',
                data: data.map(d => d.creditScore),
                borderColor: 'blue',
                yAxisID: 'y1',
                tension: 0.4,
            },
            {
                label: 'Number of Reports',
                data: data.map(d => d.reports),
                borderColor: 'green',
                yAxisID: 'y2',
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        stacked: false,
        scales: {
            y1: {
                type: 'linear',
                position: 'left',
                title: {
                    display: true,
                    text: 'Public Trust Score',
                },
            },
            y2: {
                type: 'linear',
                position: 'right',
                title: {
                    display: true,
                    text: 'Number of Reports',
                },
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
    };

    return <Line data={chartData} options={options} />;
};


export default CreditScoreChart;
