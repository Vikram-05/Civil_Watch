
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

function ReportCategory() {
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
                <h4>report category</h4>
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
                            <span>Waste</span>
                            <p>Sanitation issues</p>
                        </Link>
                    </SwiperSlide>




                    <SwiperSlide>
                        <Link to={ isLogin == true ? "/reportIssue" : '/login'} className="slide_con">
                            <div className="icon_con">
                            <FaRoad/>
                            </div>
                            <span>Road</span>
                            <p>infrastructure</p>
                        </Link>
                    </SwiperSlide><SwiperSlide>
                        <Link to={ isLogin == true ? "/reportIssue" : '/login'} className="slide_con">
                            <div className="icon_con">
                            <TbSunElectricity/>
                            </div>
                            <span>electricity</span>
                            <p>power outage</p>
                        </Link>
                    </SwiperSlide><SwiperSlide>
                        <Link to={ isLogin == true ? "/reportIssue" : '/login'} className="slide_con">
                            <div className="icon_con">
                            <FaHandHoldingWater/>
                            </div>
                            <span>water</span>
                            <p>supply issue</p>
                        </Link>
                    </SwiperSlide><SwiperSlide>
                        <Link to={ isLogin == true ? "/reportIssue" : '/login'} className="slide_con">
                            <div className="icon_con">
                            <IoTrashSharp/>
                            </div>
                            <span>Waste</span>
                            <p>Sanitation issues</p>
                        </Link>
                    </SwiperSlide><SwiperSlide>
                        <Link to={ isLogin == true ? "/reportIssue" : '/login'} className="slide_con">
                            <div className="icon_con">
                            <IoTrashSharp/>
                            </div>
                            <span>Waste</span>
                            <p>Sanitation issues</p>
                        </Link>
                    </SwiperSlide><SwiperSlide>
                        <Link to={ isLogin == true ? "/reportIssue" : '/login'} className="slide_con">
                            <div className="icon_con">
                            <IoTrashSharp/>
                            </div>
                            <span>Waste</span>
                            <p>Sanitation issues</p>
                        </Link>
                    </SwiperSlide><SwiperSlide>
                        <Link to={ isLogin == true ? "/reportIssue" : '/login'} className="slide_con">
                            <div className="icon_con">
                            <IoTrashSharp/>
                            </div>
                            <span>Waste</span>
                            <p>Sanitation issues</p>
                        </Link>
                    </SwiperSlide>





                </Swiper>
            </div>
        </>
    )
}

export default ReportCategory
