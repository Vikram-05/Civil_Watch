import React, { useState, useCallback, useEffect } from 'react';
import './ReportIssue.css';
import axios from 'axios';
import { IoLocationSharp } from "react-icons/io5";
import { ToastContainer, toast } from 'react-toastify';
import { MdDone } from "react-icons/md";
import OpenAI from "openai";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { IoClose } from "react-icons/io5";
import Avatar from '@mui/material/Avatar';
import * as turf from "@turf/turf";

import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { FreeMode, Pagination } from 'swiper/modules';
import { useTranslation } from 'react-i18next';
import '../../i18n'
import { Gemini } from '../../components/Gemini.js'
import Markdown from 'react-markdown'


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 550,
    bgcolor: 'background.paper',
    border: '2px solid rgba(0,0,0,0.5)',
    boxShadow: 24,
    p: 4,
};

function ReportIssue() {
    const { t, i18n } = useTranslation()
    const [submitLoader, setSubmitLoader] = useState(false);
    const [problemUnderYourArea, setProblemUnderYourArea] = useState([]);
    const [wardInfo, setWardInfo] = useState(null);
    const [error, setError] = useState(null);
    const [values, setValues] = useState({
        title: "",
        description: "",
        location: "",
        state: "",
        district: "",
        wardNumber: "",
        images: [],
        severity: "low",
        category: "",
        area: ""
    });
    const [openDetails, setOpenDetails] = useState(null);
    const [imgDesc, setImgDesc] = useState()
    const [isImgDesc, setIsImgDesc] = useState()
    const [loadingDesc, setLoadingDesc] = useState(false)
    const [detailData, setDetailData] = useState({
        description: "",
        district: "",
        images: [],
        location: "",
        severity: "",
        state: "",
        status: "",
        title: "",
        user_id: "",
        wardNumber: "",
        first_name: "",
        last_name: "",
        email: "",
    });
    const [likeCounts, setLikeCounts] = useState({});
    const [likedIssues, setLikedIssues] = useState([]);

    // Load liked issues from localStorage on component mount
    useEffect(() => {
        const storedLikes = localStorage.getItem('likedIssues');
        if (storedLikes) {
            setLikedIssues(JSON.parse(storedLikes));
        }
    }, []);

    const handleSeverityClick = useCallback((level) => {
        setValues(prev => ({ ...prev, severity: level }));
    }, []);

    const handleImageUpload = useCallback(async (e) => {
        setLoadingDesc(true)
        const files = Array.from(e.target.files);
        setImgDesc(e.target.value)


        async function getDesc() {
            try {
                const response = await Gemini(imgDesc);
                console.log("rreessooppnsse +> ", response)
                setIsImgDesc(response)
                setValues(prev => ({ ...prev, description: response }))
                setLoadingDesc(false)
            } catch (error) {
                console.log("error in generation description")
            }
        }
        getDesc()

        if (files.length === 0) return;

        const validFiles = files.filter(file => {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            const maxSize = 5 * 1024 * 1024;
            return validTypes.includes(file.type) && file.size <= maxSize;
        });

        if (validFiles.length !== files.length) {
            toast.warning("Some files were invalid (only JPG/PNG/GIF under 5MB allowed)");
        }

        setValues(prev => ({
            ...prev,
            images: [...prev.images, ...validFiles]
        }));

    }, []);

    const removeImage = useCallback((index) => {
        setValues(prev => {
            const newImages = [...prev.images];
            newImages.splice(index, 1);
            return { ...prev, images: newImages };
        });
    }, []);

   

    const AllRep = useCallback(async (state, district, wardNumber) => {
        // console.log("GGG : ",state, district, wardNumber)
        // Add validation to ensure required parameters are present
        if (!state || !district || !wardNumber) {
            console.warn("Missing location parameters for AllRep", { state, district, wardNumber });
            return;
        }

        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/problem/problemUnderUser/all`, {
                params: {
                    state: state.toLowerCase().trim(),
                    district: district.toLowerCase().trim(),
                    wardNumber
                }
            });

            if (response.data?.AllProblemData) {
                setProblemUnderYourArea(response.data.AllProblemData);
                const initialLikes = {};
                response.data.AllProblemData.forEach(problem => {
                    initialLikes[problem._id] = problem.noOfPerson || 0;
                });
                setLikeCounts(initialLikes);
            }
        } catch (error) {
            console.error("Error in fetching problems: ", error);
            toast.error("Failed to fetch problems in your area");
        }
    }, []);

    const useCurrentLocation = useCallback(async () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            const location = `${position.coords.latitude}, ${position.coords.longitude}`;
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/map/getlocation`, {
                params: { location }
            });

            const { state, distric } = res.data.data;

            // const wardInfo = await getWardFromCoordinates(12.941624, 77.566814);
            const wardInfo = await getWardFromCoordinates(position.coords.latitude, position.coords.longitude);

            if (!wardInfo) {
                toast.warning("Ward could not be determined automatically. Please enter manually.");
            }

            setValues(prev => ({
                ...prev,
                location,
                state: state || '',
                district: distric || '',
                wardNumber: wardInfo?.wardNo || '',
                area: wardInfo?.wardName || ''
            }));

            // Only call AllRep if ward info is available
            if (wardInfo) {
                AllRep(state.toLowerCase().trim(), distric.toLowerCase().trim(), wardInfo?.wardNo || '');
            }

        } catch (error) {
            console.error("Location error:", error);
            toast.error("Could not retrieve your location. Please enter it manually.");
        }
    }, [AllRep]);
     const handleGetAlls = useCallback(() => {
    const { state, district, wardNumber } = values;

    if (!state || !district || !wardNumber) {
        toast.warning("Please enter state, district, and ward number to fetch problems.");
        return;
    }

    AllRep(state, district, wardNumber);
}, [values, AllRep]);




    const handleGetAll = useCallback(() => {
        if (!values.state || !values.district || !values.wardNumber) {
            toast.warning("Please set your location first");
            return;
        }
        AllRep(values.state, values.district, values.wardNumber);
    }, [values.state, values.district, values.wardNumber, AllRep]);

    const handleCategoryChange = useCallback((e) => {
        const category = e.target.value;
        setValues(prev => ({
            ...prev,
            category,
            title: category ? `${category} Issue` : ""
        }));
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (submitLoader) return;

        const requiredFields = ['title', 'location', 'state', 'district', 'wardNumber'];
        const missingFields = requiredFields.filter(field => !values[field]);

        if (missingFields.length > 0) {
            toast.error(`Please fill in: ${missingFields.join(', ')}`);
            return;
        }

        setSubmitLoader(true);

        try {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('description', values.description);
            formData.append('location', values.location);
            formData.append('severity', values.severity);
            formData.append('state', values.state.toLowerCase().trim());
            formData.append('district', values.district.toLowerCase().trim());
            formData.append('wardNumber', values.wardNumber);

            values.images.forEach((image) => {
                formData.append('images', image);
            });

            const token = localStorage.getItem('token');
            await axios.post(
                `${import.meta.env.VITE_BASE_URL}/problem/createProblem`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setValues({
                title: "",
                description: "",
                location: "",
                state: "",
                district: "",
                wardNumber: "",
                images: [],
                severity: "low",
                category: "",
                area: ""
            });

            toast.success("Issue reported successfully!");
            handleGetAll();
        } catch (error) {
            console.error('Submission error:', error);
            toast.error(error.response?.data?.message || "Failed to submit. Please try again.");
        } finally {
            setSubmitLoader(false);
        }
    }, [values, submitLoader, handleGetAll]);

    const handleOpenDetails = useCallback(async (taskId) => {
        setOpenDetails(taskId);
        try {
            const [problemData, UserData] = await Promise.all([
                axios.get(`${import.meta.env.VITE_BASE_URL}/problem/getProblemData/${taskId}`),
                axios.get(`${import.meta.env.VITE_BASE_URL}/user/${taskId}`)
            ]);

            const { description, district, location, severity, state, status, title, wardNumber, user_id, images } = problemData.data.data;
            const { email, first_name, last_name } = UserData.data;

            setDetailData({
                description,
                district,
                location,
                severity,
                state,
                status,
                title,
                wardNumber,
                user_id,
                images,
                first_name,
                last_name,
                email
            });
        } catch (error) {
            console.error("Error fetching details:", error);
            toast.error("Failed to load problem details");
        }
    }, []);

    const handleCloseDetails = useCallback(() => {
        setOpenDetails(null);
    }, []);

    const handlelike = useCallback(async (id, e) => {
        e.stopPropagation();

        try {
            let response;
            let newLikedIssues;
            let newLikeCounts = { ...likeCounts };

            if (likedIssues.includes(id)) {
                // User is unliking
                response = await axios.put(`${import.meta.env.VITE_BASE_URL}/problem/decrementLike/${id}`);
                newLikedIssues = likedIssues.filter(issueId => issueId !== id);
                newLikeCounts[id] = (newLikeCounts[id] || 1) - 1;
                toast.success("Like removed!");
            } else {
                // User is liking
                response = await axios.put(`${import.meta.env.VITE_BASE_URL}/problem/updateuserreport/${id}`);
                newLikedIssues = [...likedIssues, id];
                newLikeCounts[id] = (newLikeCounts[id] || 0) + 1;
                toast.success("Issue liked!");
            }

            setLikedIssues(newLikedIssues);
            setLikeCounts(newLikeCounts);
            localStorage.setItem('likedIssues', JSON.stringify(newLikedIssues));
        } catch (error) {
            console.error("Error updating like:", error);
            toast.error("Failed to update like status");
        }
    }, [likedIssues, likeCounts]);

    // Loads the GeoJSON once and caches it
    let cachedGeoJSON = null;

    async function getWardFromCoordinates(latitude, longitude) {
        const point = turf.point([longitude, latitude]); // GeoJSON uses [lng, lat]

        // Load GeoJSON if not already cached
        if (!cachedGeoJSON) {
            const response = await fetch("/bbmp_wards.geojson");
            // console.log("ward details : ",response)
            if (!response.ok) throw new Error("Failed to load ward boundaries");
            cachedGeoJSON = await response.json();
            // console.log("ward details :=>>> ",cachedGeoJSON)
        }

        // Search for the ward polygon that contains the point
        for (const feature of cachedGeoJSON.features) {
            console.log("aa => ", feature)
            if (turf.booleanPointInPolygon(point, feature)) {
                return {
                    wardNo: feature.properties.WardNo,
                    wardName: feature.properties.WardName || "Unknown",
                };
            }
        }

        // Not found
        return null;
    }

    return (
        <>
            <form className="report_con" onSubmit={handleSubmit}>
                <h4 className='report_title'>{t('ReportanIssue')}</h4>

                <label className='a'>{t('IssueCategory')}
                    <select required value={values.category} onChange={handleCategoryChange}>
                        <option value="">{t('Selectissuetype')}</option>
                        <option value="road">{t('Road')}</option>
                        <option value="electricity">{t('Electricity')}</option>
                        <option value="waste">{t('Waste')}</option>
                        <option value="sanitation">{t('Sanitation')}</option>
                        <option value="animalcontrol">{t('Animalcontrol')}</option>
                        <option value="water">{t('Other')}</option>
                    </select>
                </label>
                <div className="upload_box">
                    <input
                        type="file"
                        multiple
                        onChange={handleImageUpload}
                        accept="image/jpeg, image/png, image/gif"
                    />
                    {values.images.length > 0 && (
                        <div className="image_preview">
                            {values.images.map((image, index) => (
                                <div key={index} className="image_container">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        className="image_thumb"
                                        alt={`Preview ${index}`}
                                    />
                                    <button
                                        type="button"
                                        className="remove_image"
                                        onClick={() => removeImage(index)}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="dec_box">
                    <span htmlFor="description">{t('Description')}</span>
                    {
                        loadingDesc ? (
                            <p className='loadingDes'>loading...</p>
                        ) : isImgDesc ? (
                            <span className='imgDesc'><Markdown>{isImgDesc}</Markdown></span>
                        ) : (
                            <textarea
                                value={isImgDesc}
                                onChange={e => setIsImgDesc(e.target.value)}
                                id="description"
                                placeholder={t('Describetheissueindetail')}
                            />
                        )
                    }

                </div>
                {/* <p>{isImgDesc}</p> */}

                <span className="location_title">{t('Location')}</span>
                <button type="button" className='current_loc' onClick={useCurrentLocation}>
                    {t('UseCurrentLocation')}
                </button>
                <div className="location_box">
                    <input
                        onChange={e => setValues({ ...values, location: e.target.value })}
                        type="text"
                        value={values.location}
                        placeholder={t('Enterlocation')}
                        required
                    />
                    <IoLocationSharp className='location' />
                </div>

                <div className="loc_info">
                    <div className="det_box1">
                        <span className='state'>{t('State')}</span>
                        <input
                            value={values.state}
                            type="text"
                            placeholder={t('EnterState')}
                            onChange={e => setValues({ ...values, state: e.target.value })}
                            required
                        />
                    </div>
                    <div className="det_box2">
                        <span className='district'>{t('District')}</span>
                        <input
                            value={values.district}
                            type="text"
                            placeholder={t('EnterDistrict')}
                            onChange={e => setValues({ ...values, district: e.target.value })}
                            required
                        />
                    </div>
                    <div className="det_box3">
                        <span className='wardNo'>{t('WardNo.')}</span>
                        <input
                            value={values.wardNumber}
                            type="text"
                            placeholder={t('EnterWardNumber')}
                            onChange={e => setValues({ ...values, wardNumber: e.target.value })}
                            required
                        />
                    </div>
                    <div className="det_box3">
                        <span className='wardNo'>{t('Area')}</span>
                        <input
                            value={values.area}
                            type="text"
                            placeholder={t('EnterArea')}
                            onChange={e => setValues({ ...values, area: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="active_issue_con">
                    {problemUnderYourArea.length !== 0 && (
                        <>
                            <h4>{t('Problemsnearyou')}</h4>
                            <div className="category_contaner">
                                <Swiper
                                    slidesPerView={4}
                                    spaceBetween={10}
                                    freeMode={true}
                                    pagination={false}
                                    navigation={true}
                                    modules={[FreeMode, Pagination, Navigation]}
                                    className="mySwiper swiper_report"
                                    breakpoints={{
                                        320: {
                                            slidesPerView: 1,
                                        },
                                        480: {
                                            slidesPerView: 2,
                                        },
                                        768: {
                                            slidesPerView: 3,
                                        },
                                        1024: {
                                            slidesPerView: 4,
                                        },
                                    }}
                                >
                                    {problemUnderYourArea
                                        .filter(item => item.status !== 'resolved')
                                        .map((item) => (
                                            <SwiperSlide key={item._id}>
                                                <div className="slide_con1" >
                                                    <div className="card">
                                                        <div className="slideshow-container">
                                                            <img className="slides" src={item.images[0]} alt="Slide 1" />
                                                        </div>
                                                        <div className="details">
                                                            <h3>{item.title}</h3>
                                                            <div className="info"><strong>Severity:</strong> <span className='info1'>{item.severity}</span></div>
                                                            <div className="info"><strong>Location:</strong> <span className='info1' >{`${item.state}, ${item.district} ward number ${item.wardNumber}`}</span></div>
                                                            <div className="description1">
                                                                <Markdown>{item.description}</Markdown>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={`upvote ${likedIssues.includes(item._id) ? 'liked' : ''}`}
                                                            onClick={(e) => handlelike(item._id, e)}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                                <path d="M10 2l5 9H5l5-9zm0 3.2L7.6 10h4.8L10 5.2zM3 12h14v2H3v-2z"></path>
                                                            </svg>
                                                            <span>{likeCounts[item._id] ?? item.noOfPerson}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        ))
                                    }
                                </Swiper>
                            </div>
                        </>
                    )}

                    <Modal
                        open={openDetails !== null && openDetails !== false}
                        onClose={handleCloseDetails}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style} className="d">
                            <IoClose className='close_btn' onClick={handleCloseDetails} />
                            <div className="details_contaner">
                                <Avatar className='avtar' alt="Remy Sharp" src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
                                <p className="name_user" >{`${detailData.first_name} ${detailData.last_name}`}</p>
                                <span className='email'>{detailData.email}</span>
                                <span className='loc'>{`${detailData.state}, ${detailData.district} ward number ${detailData.wardNumber}`}</span>
                                <h4 className='issue'>Problem Category : </h4>
                                <span >{detailData.title}</span>
                                <br />
                                <h4 className='issue'>Priority : </h4>
                                <span>{detailData.severity}</span>
                                <h4 >Discription : </h4>
                                <span className='disc'>{detailData.description}</span>
                                <div className="all_img">
                                    {detailData.images.map((img, idx) => (
                                        <img key={idx} src={img} alt={`Issue image ${idx + 1}`} />
                                    ))}
                                </div>
                                <h4 className='issue'>Current Status : </h4>
                                <span>{detailData.status}</span>
                            </div>
                        </Box>
                    </Modal>
                </div>

                <div className="level_con">
                    <span className="level">{t('SeverityLevel')}</span>
                    <button type="button" onClick={() => handleSeverityClick("low")} className={values.severity === "low" ? "active_Severity" : ""}>{t('Low')}</button>
                    <button type="button" onClick={() => handleSeverityClick("medium")} className={values.severity === "medium" ? "active_Severity" : ""}>{t('Medium')}</button>
                    <button type="button" onClick={() => handleSeverityClick("high")} className={values.severity === "high" ? "active_Severity" : ""}>{t('High')}</button>
                </div>

                <div className="preview_box">
                    <span>{t('Preview')}</span>
                    <p>{t('Reviewyourreportbeforesubmission')}</p>
                    <div className="btn_con">
                        <button
                            type="button"
                            onClick={handleGetAlls}
                            className='submit'
                        >
                            {t('Get problems in this area')}
                        </button>

                        <button
                            type="submit"
                            className='submit'
                            disabled={submitLoader}
                        >
                            {submitLoader ? (
                                <div className="lds-dual-ring"></div>
                            ) : (
                                <>{t('SubmitReport')}</>
                            )}
                        </button>
                    </div>

                </div>
            </form>
            <ToastContainer />
        </>
    );
}

export default ReportIssue;