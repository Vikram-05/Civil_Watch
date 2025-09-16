import React from 'react'
import './chart.css'
import { Line } from 'react-chartjs-2';
import CreditScoreChart from '../CreditScoreChart/CreditScoreChart';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Legend,
    Tooltip,
} from 'chart.js';

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Legend,
    Tooltip
);



const sampleData = [
    { time: 'Jan', creditScore: 680, reports: 5 },
    { time: 'Feb', creditScore: 690, reports: 4 },
    { time: 'Mar', creditScore: 710, reports: 3 },
    { time: 'Apr', creditScore: 700, reports: 6 },
];

function Chart() {
    return (
        <div className='chart_boc'>
            <h4>Public Trust Score vs Number of Reports Over Time</h4>
            <CreditScoreChart className="chart" data={sampleData} />
        </div>
    );
}




export default Chart