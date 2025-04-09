import React, { useState } from 'react';
import './ReportIssue.css';
import axios from 'axios';
import { IoLocationSharp } from "react-icons/io5";
import { ToastContainer, toast } from 'react-toastify';

function ReportIssue() {
    const [submitLoader, setSubmitLoader] = useState(false);
    const [values, setValues] = useState({
        title: "",
        description: "",
        location: "",
        state: "",
        district: "",
        wardNumber: "",
        images: [],
        severity: "low",
        category: ""
    });

    const handleSeverityClick = (level) => {
        setValues(prev => ({ ...prev, severity: level }));
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        
        if (files.length === 0) return;

        // Validate files
        const validFiles = files.filter(file => {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            const maxSize = 5 * 1024 * 1024; // 5MB
            return validTypes.includes(file.type) && file.size <= maxSize;
        });

        if (validFiles.length !== files.length) {
            toast.warning("Some files were invalid (only JPG/PNG/GIF under 5MB allowed)");
        }

        setValues(prev => ({
            ...prev,
            images: [...prev.images, ...validFiles]
        }));
    };

    const removeImage = (index) => {
        setValues(prev => {
            const newImages = [...prev.images];
            newImages.splice(index, 1);
            return { ...prev, images: newImages };
        });
    };

    const useCurrentLocation = async () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            
            const location = `${position.coords.latitude}, ${position.coords.longitude}`;
            setValues(prev => ({ ...prev, location }));

            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/map/getlocation`, {
                params: { location }
            });

            const { state, distric, pincode } = res.data.data;
            setValues(prev => ({
                ...prev,
                state: state || '',
                district: distric || '',
                wardNumber: pincode || ''
            }));

        } catch (error) {
            toast.error("Could not retrieve your location. Please enter it manually.");
        }
    };

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setValues(prev => ({
            ...prev,
            category,
            title: category ? `${category} Issue` : ""
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (submitLoader) return;
        
        // Validate required fields
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

            // Append each image file
            values.images.forEach((image, index) => {
                formData.append('images', image);
            });

            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/problem/createProblem`,
                formData,
                { 
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    } 
                }
            );

            // Reset form
            setValues({
                title: "",
                description: "",
                location: "",
                state: "",
                district: "",
                wardNumber: "",
                images: [],
                severity: "low",
                category: ""
            });

            toast.success(response.data.message || "Issue reported successfully!");
        } catch (error) {
            console.error('Submission error:', error);
            toast.error(error.response?.data?.message || "Failed to submit. Please try again.");
        } finally {
            setSubmitLoader(false);
        }
    };

    return (
        <>
            <form className="report_con" onSubmit={handleSubmit}>
                <h4 className='report_title'>Report an Issue</h4>

                <label className='a'>Issue Category
                    <select required value={values.category} onChange={handleCategoryChange}>
                        <option value="">Select issue type</option>
                        <option value="road">Road</option>
                        <option value="electricity">Electricity</option>
                        <option value="water">Water</option>
                        <option value="waste">Waste</option>
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
                    <span htmlFor="description">Description</span>
                    <textarea 
                        value={values.description} 
                        onChange={e => setValues({ ...values, description: e.target.value })} 
                        id="description" 
                        placeholder="Describe the issue in detail"
                    />
                </div>

                <span className="location_title">Location</span>
                <button type="button" className='current_loc' onClick={useCurrentLocation}>
                    Use Current Location
                </button>
                <div className="location_box">
                    <input
                        onChange={e => setValues({ ...values, location: e.target.value })}
                        type="text"
                        value={values.location}
                        placeholder='Enter location'
                        required
                    />
                    <IoLocationSharp className='location' />
                </div>

                <div className="loc_info">
                    <div className="det_box1">
                        <span className='state'>State</span>
                        <input 
                            value={values.state} 
                            type="text" 
                            placeholder='Enter State' 
                            onChange={e => setValues({ ...values, state: e.target.value })} 
                            required
                        />
                    </div>
                    <div className="det_box2">
                        <span className='district'>District</span>
                        <input 
                            value={values.district} 
                            type="text" 
                            placeholder='Enter District' 
                            onChange={e => setValues({ ...values, district: e.target.value })} 
                            required
                        />
                    </div>
                    <div className="det_box3">
                        <span className='wardNo'>Pincode</span>
                        <input 
                            value={values.wardNumber} 
                            type="text" 
                            placeholder='Enter Ward Number' 
                            onChange={e => setValues({ ...values, wardNumber: e.target.value })} 
                            required
                        />
                    </div>
                </div>

                <div className="level_con">
                    <span className="level">Severity Level</span>
                    <button type="button" onClick={() => handleSeverityClick("low")} className={values.severity === "low" ? "active_Severity" : ""}>Low</button>
                    <button type="button" onClick={() => handleSeverityClick("medium")} className={values.severity === "medium" ? "active_Severity" : ""}>Medium</button>
                    <button type="button" onClick={() => handleSeverityClick("high")} className={values.severity === "high" ? "active_Severity" : ""}>High</button>
                </div>

                

                <div className="preview_box">
                    <span>Preview</span>
                    <p>Review your report before submission</p>
                    <div className="btn_con">
                        <button type="submit" className='submit' disabled={submitLoader}>
                            {submitLoader ? <div className="lds-dual-ring"></div> : "Submit Report"}
                        </button>
                    </div>
                </div>
            </form>
            <ToastContainer />
        </>
    );
}

export default ReportIssue;
