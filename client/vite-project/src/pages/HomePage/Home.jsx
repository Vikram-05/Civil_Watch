import React from 'react'

import ReportCategory from '../../components/ReportCateSlider/ReportCategory';
import WorksCategory from '../../components/worksCategory/WorksCategory';
import Success from '../../components/successComponent/Success';
import Search from '../../components/searchBar/Search';
import Counter from '../../components/count/Counter';
import a from '../../../public/aiIcon.png'
import { Link } from 'react-router-dom';
import './Home.css'

import { useTranslation } from 'react-i18next';
import '../../i18n'



function Home() {
    const {t,i18n} = useTranslation()
    return (
        <>
            <div className="home_contaner">
                <h2>{t('mainTitle')}</h2>
                <p className='disc'>{t('subTitle')}</p>
                <Search/>
                <Counter/>
                <ReportCategory/>
                <WorksCategory/>
                <Success/>
                <div className="ai_contane">
                    <span className='rights'>{t('knowrights')}</span>
                    <Link to="/ai" className="img_con">
                    <img src={a} alt="" />
                    </Link>
                </div>
            </div>
        </>
    )
}
export default Home;
