import React, { useEffect, useState } from 'react'
import './RepresentativeProfile.css'
import Avatar from '@mui/material/Avatar';
import { MdOutlineStars } from "react-icons/md";
import { MdFileDownloadDone } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import { HiExclamationTriangle } from "react-icons/hi2";

import axios from 'axios';
import { useParams } from 'react-router-dom';

function RepresentativeProfile() {
    const [representativeData, setRepresentativeData] = useState(null);
    const [creditScore, setCreditScore] = useState(0)
    const [AllReview, setAllReview] = useState([])
    const [reviewUsers, setReviewUsers] = useState({});
    const { id } = useParams()

    useEffect(() => {
        // Fetch data for the representative when the component mounts or id changes
        const fetchData = async () => {
            try {
                console.log("Fetching representative data for ID:", id);
                const response = await axios.get(`https://images.pexels.com/api/users/representativeProfile/${id}`);
                setRepresentativeData(response.data.data);
                let total = 0;
                const res = await axios.get(`https://images.pexels.com/api/users/credit/getSimilarRep/${id}`)
                for (let score of res.data.AllRepresentative) {
                    total += score.credit_score;
                }
                setCreditScore(total)

                setAllReview(res.data.AllRepresentative);

                // Create a list of promises to fetch user data for each review
                const userNamesPromises = res.data.AllRepresentative.map(async (review) => {
                    const userRes = await axios.get(`https://images.pexels.com/api/users/${review.user_id}`);
                    return { userId: review.user_id, name: `${userRes.data.first_name} ${userRes.data.last_name}` };
                });

                // Wait for all the user data to be fetched
                const userNamesData = await Promise.all(userNamesPromises);

                // Create a user lookup object
                const userNames = userNamesData.reduce((acc, { userId, name }) => {
                    acc[userId] = name;
                    return acc;
                }, {});

                setReviewUsers(userNames);
                // console.log("score ",total)
                console.log("res ", response.data.data)
            } catch (error) {
                console.log("Error in fetching representative data", error);
            }
        };

        // Only fetch data if id is available
        if (id) {
            fetchData();
        }
    }, [id]);
    if(!representativeData) {
       return <p className='loader'>Loading...</p>; // You can show a loading spinner or message
    }




    return (
        <>
            <div className="repsantative_contaner">
                <div className="profile_det_con">
                    <Avatar className='avtar' alt="Remy Sharp" src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
                    <p className="rep_name">{`${representativeData.first_name} ${representativeData.last_name}`}</p>
                    <span className="email d_block">{`Email : ${representativeData.email}`}</span>
                    <span className="location_area d_block">{`State : ${representativeData.state}`}</span>
                    <span className="location_area d_block">{`District : ${representativeData.district} ward number :  ${representativeData.wardNumber}`}</span>
                    <div className="contact_btn_con">
                        <button className='contact_btn'>Contact Representative</button>
                        <button className="view">View Service Area</button>
                    </div>
                </div>
                <div className="credit_det_con">
                    <MdOutlineStars className='icon' />
                    <p className='credit_score'>{`Credit Score : ${creditScore}`}</p>
                    <span className="det">Top 10% representative in the region</span>
                    <button className='view_his'>View History</button>

                </div>



                <h4>Recent Reviews</h4>

                <div className="review_main_con">
                    {
                        AllReview.length > 0 ? 
                        AllReview.map((item, idx) => (
                            <div key={item._id} className="review_con">
                                <Avatar className='avtar' alt="Remy Sharp" src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
                                <div className="avtar_det">
                                    <p className="name">{reviewUsers[item.user_id]}</p>
                                    <span className="message">{(item.feedback).split(' ').length > 10 ? item.feedback.split(' ').slice(0, 6).join(' ') + "..." : item.feedback}<span className="credit_score">{`|  credit Score :  +${item.credit_score}`}</span></span>

                                </div>
                                <AiOutlineLike className='like' />
                            </div>
                        ))
                        :
                        <span>No Review</span>
                    }
                </div>

                <h5>Leave a Review</h5>
                <textarea placeholder="Share your experience with this representative" name="" id=""></textarea>

                <button className='submit_rev'>Submit Review</button>

            </div>
        </>
    )
}

export default RepresentativeProfile 
