
import './ReportCategory.css'

import React, { useEffect, useRef, useState } from 'react';
import { Navigation } from 'swiper/modules';
import 'swiper/css/navigation';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { FreeMode, Pagination } from 'swiper/modules';

import { IoTrashSharp } from "react-icons/io5";
import { FaRoad } from "react-icons/fa";
import { TbSunElectricity } from "react-icons/tb";
import { FaHandHoldingWater } from "react-icons/fa";

import {Link} from 'react-router-dom'
import '../../i18n'
import { useTranslation } from 'react-i18next';

function ReportCategory() {
        const {t,i18n} = useTranslation()
    const [isLogin,setIsLogin] = useState(false);
    const token = localStorage.getItem('token');
    useEffect(()=>{
        if(token){
            setIsLogin(true)
        }else{
            setIsLogin(false)
        }

    },[])
    return (
        <>
            <div className="category_contaner">
                <h4>{t('reportcategory')}</h4>
                <Swiper
                    slidesPerView={4}
                    spaceBetween={10}
                    freeMode={true}
                    pagination={false}
                    navigation={true}
                    modules={[FreeMode, Pagination,Navigation]}
                    className="mySwiper swiper_report"
                    breakpoints={{
                        // When the viewport width is >= 320px
                        320: {
                          slidesPerView: 2,
                        },
                        // When the viewport width is >= 480px
                        480: {
                          slidesPerView: 2,
                        },
                        // When the viewport width is >= 768px
                        768: {
                          slidesPerView: 3,
                        },
                        // When the viewport width is >= 1024px
                        1024: {
                          slidesPerView: 4,
                        },
                      }}
                >
                    <SwiperSlide>
                        <Link to={ isLogin == true ? "/reportIssue" : '/login'} className="slide_con">
                            <div className="icon_con">
                            <IoTrashSharp/>
                            </div>
                            <span>{t('Waste')}</span>
                            <p>{t('Sanitation')} {t('issues')} </p>
                        </Link>
                    </SwiperSlide>




                    <SwiperSlide>
                        <Link to={ isLogin == true ? "/reportIssue" : '/login'} className="slide_con">
                            <div className="icon_con">
                            <FaRoad/>
                            </div>
                            <span>{t('Road')}</span>
                            <p>{t('infrastructure')}</p>
                        </Link>
                    </SwiperSlide><SwiperSlide>
                        <Link to={ isLogin == true ? "/reportIssue" : '/login'} className="slide_con">
                            <div className="icon_con">
                            <TbSunElectricity/>
                            </div>
                            <span>{t('Electricity')}</span>
                            <p>{t('poweroutage')}</p>
                        </Link>
                    </SwiperSlide><SwiperSlide>
                        <Link to={ isLogin == true ? "/reportIssue" : '/login'} className="slide_con">
                            <div className="icon_con">
                            <FaHandHoldingWater/>
                            </div>
                            <span>{t('Animalcontrol')}</span>
                            <p>{t('Animalcontrol')} {t('issues')}</p>
                        </Link>
                    </SwiperSlide><SwiperSlide>
                        <Link to={ isLogin == true ? "/reportIssue" : '/login'} className="slide_con">
                            <div className="icon_con">
                            <FaHandHoldingWater/>
                            </div>
                            <span>{t('Sanitation')}</span>
                            <p>{t('Sanitation')} {t('issues')}</p>
                        </Link>
                    </SwiperSlide>





                </Swiper>
            </div>
        </>
    )
}

export default ReportCategory
