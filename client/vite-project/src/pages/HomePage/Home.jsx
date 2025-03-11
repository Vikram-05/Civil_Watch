import React from 'react'

import ReportCategory from '../../components/ReportCateSlider/ReportCategory';
import WorksCategory from '../../components/worksCategory/WorksCategory';
import Success from '../../components/successComponent/Success';
import Search from '../../components/searchBar/Search';
import Counter from '../../components/count/Counter';
import a from '../../../public/aiIcon.png'
import { Link } from 'react-router-dom';
import './Home.css'

function Home() {
    return (
        <>
            <div className="home_contaner">
                <h2>Empower your community</h2>
                <p className='disc'>report local issues, track solutions, and rate representative  performance </p>
                <Search/>
                <Counter/>
                <ReportCategory/>
                <WorksCategory/>
                <Success/>
                <div className="ai_contane">
                    <span className='rights'>Know your rights</span>
                    <Link to="/ai" className="img_con">
                    <img src={a} alt="" />
                    </Link>
                </div>
            </div>
        </>
    )
}
export default Home;
