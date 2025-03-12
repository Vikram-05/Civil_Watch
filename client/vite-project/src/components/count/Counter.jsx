import React, { useState } from 'react'
import './Count.css'
import CountUp from 'react-countup';
import { MdReportProblem } from "react-icons/md";
import { MdDoneOutline } from "react-icons/md";
import vid from '../../../public/loop.mp4'

function Counter() {
    const [totalProblem, setTotalProblem] = useState(0)
    const getTotalProblem = async () => {

    }




    return (
        <>
            <div className="counter_con">
                <div className="data_show">
                    <div className="first_count com_count">
                        <MdReportProblem className='pro_icon' />
                        <CountUp className='counter_inc' end={186} duration={2.5} delay={0.7}/>
                        <p className='total_pro'>total Problems</p>
                    </div>
                    <div className="sec_count com_count">
                        <MdDoneOutline className='pro_icon' />
                        <CountUp className='counter_inc' end={126} duration={2.5} delay={0.7}/>
                        <p className='total_pro'>solved Problems</p>

                    </div>
                </div>
                <div className="aids ">
                    <video src={vid} autoPlay loop muted controls={false} />
                </div>
            </div>
        </>
    )
}

export default Counter
