import React, { useEffect, useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
import './Search.css';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import '../../i18n'

function Search() {
        const {t,i18n} = useTranslation()
    const [searchData, setSearchData] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (!searchData.trim()) {
                setResults([]); // Clear results if search is empty
                return;
            }

            setLoading(true); // Set loading to true
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}`, {
                    params: {
                        first_name: searchData,
                        last_name: searchData,
                        location: searchData,
                        state: searchData,
                        district: searchData,
                    },
                });
                console.log("data : ", response)
                setResults(response.data.data || []); // Store results from API response
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false); // Set loading to false
            }
        };

        const debounceTimeout = setTimeout(fetchData, 500);

        return () => clearTimeout(debounceTimeout);
    }, [searchData]);

    const HandleRepresentative = (id) => {
        navigate(`/represantativeProfile/${id}`)
    }

    return (
        <>
            <div className="search">
                <input
                    value={searchData}
                    type="text"
                    placeholder={t('Searchrepresentativesbynamelocation')}
                    onChange={(e) => setSearchData(e.target.value)}
                />
                <IoSearchOutline className="search_icon" />
            </div>

            {loading && <div className='loader_con'><div class="dot-spinner">
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
            </div></div>}

            <div className="search-results">
                {results.length > 0 ? (
                    results.map((item, index) => (
                        <div key={item._id} className="result-item" onClick={() => HandleRepresentative(item._id)}>
                            <div className="avtar_con">
                                <Avatar alt="Remy Sharp" src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
                                <p className='rep_name'>
                                    {item.first_name} {item.last_name}
                                </p>
                            </div>
                            <p className='search_loc'>{item.state}</p>
                            <p className='search_loc'>{item.district}</p>
                            <p className='search_loc hide'>{item.email}</p>
                        </div>
                    ))
                ) : (

                     <p className={searchData.length == 0 ? 'msg none' : 'msg'}>No results found</p>

                )}
            </div>
        </>
    );
}

export default Search;
