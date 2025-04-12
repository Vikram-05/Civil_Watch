import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import './Header.css'
import Login from '../../pages/LogIn/Login';
import { MdOutlineHome } from "react-icons/md";
import { LuBadgePlus } from "react-icons/lu";
import { IoPeopleSharp } from "react-icons/io5";
import { FaUser } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { IoLogOut } from "react-icons/io5";
import { RiMenu2Line } from "react-icons/ri";
import { toast, ToastContainer } from 'react-toastify';
import { IoLogInSharp } from "react-icons/io5";
import { BsSignIntersectionFill } from "react-icons/bs";
import Avatar from '@mui/material/Avatar';

import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

import { AiFillInstagram } from "react-icons/ai";
import { TbBrandWhatsappFilled } from "react-icons/tb";
import { FaFacebookF } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";

import '../../i18n'

import axios from 'axios';
import { useTranslation } from 'react-i18next';

function Header() {
  const [isLogin, setIsLogin] = useState(Boolean(localStorage.getItem('token')))
  const [isCitizen, setCitizen] = useState(true)
  const location = useLocation()

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

 const list = (anchor) => (
    <Box sx={{ maxWidth: '100%', width: 'auto' }}
  
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <div className="menu_main_con">
      <IoClose className='close_btn'/>
        <h2 className='logo_drawer'>CivilWatch</h2>
        <Link to="/"><span><MdOutlineHome className='icon_drawer' />Home</span></Link>
        {(isCitizen == true && isLogin) && <Link to="/reportIssue"><span><LuBadgePlus className='icon_drawer' />Report Issue</span></Link>}
      <Link>  <span><IoPeopleSharp className='icon_drawer' />Representatives</span></Link>
      {
            !isLogin ?
              (<>
                <Link to="/Login"><span className='login' ><IoLogInSharp className='icon_drawer' />Log In</span></Link>
                <Link className='btn_sign' to="/signup"><span className='signup'><BsSignIntersectionFill className='icon_drawer'/>Sign Up</span></Link>
              </>)
              :
              (<>
              
                <Link className='btn_sign' to="/login" > <IoLogOut className='icon_drawer' /><span className='logout' onClick={handleLogout}>Log out</span></Link>
              </>)
          }
      
      <h4>Contact Us : </h4>
      <div className="cont_icon_box">
        <Link><AiFillInstagram className='social_link'/></Link>
        <Link><TbBrandWhatsappFilled className='social_link'/></Link>
        <Link><FaFacebookF className='social_link'/></Link>
        <Link><FaTelegramPlane className='social_link'/></Link>
        <Link><FaTwitter className='social_link'/></Link>
      </div>
      </div>
    </Box>
  );

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };



  useEffect(() => {

    const getUserData = async (e) => {
      const userId = localStorage.getItem('user_id')
      const UserData = await axios.get(`${import.meta.env.VITE_BASE_URL}/${userId}`)
      if (UserData.data.role == "representative") {
        setCitizen(false)
      }
      else{
        setCitizen(true)
      }
    }
    getUserData()

    function handleStorageChange() {
      const token = localStorage.getItem('token')
      setIsLogin(!!token);
    }
    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location.pathname]);

  function handleLogout() {
    localStorage.removeItem('token')
    // toast('Logout Successful')
    setIsLogin(false)
  }

    const {t,i18n} = useTranslation()

    const changeLanguage = (lng) => {
      i18n.changeLanguage(lng)
    }

  return (
    <>
      <div className="contaner">
        <div className="left_header">
          <Link to="/"><p className='logo'>{t('logoName')}</p></Link>
          <Link className='links' to="/"><span><MdOutlineHome className='icon' />{t('home')}</span></Link>
          {(isCitizen == true && isLogin) && <Link to="/reportIssue"  className='links'><span><LuBadgePlus className='icon_drawer' />{t('report Issue')}</span></Link>}
          <Link className='links'><span><IoPeopleSharp className='icon ' />{t('Representative')}</span></Link>
        </div>
        <div className="right_header">
          {
            !isLogin ?
              (<>
                <Link to="/Login"><span className='login links' >{t('login')}</span></Link>
                <Link className='btn_sign links' to="/signup "><span className='signup'>{t('signup')}</span></Link>
              </>)
              :
              (<>
                <Link to={isCitizen === true ? "/user" : "/RepresentativeDashboard"} className="user_logo">
                  {/* <FaUser className='ico'/> */}
                  <Avatar alt="Remy Sharp" src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
                </Link>
                <Link className='btn_sign links' to="/login" ><span className='logout' onClick={handleLogout}>{t('logout')}</span></Link>
              </>)
          }
          {(isCitizen == true && isLogin) && <Link to="/reportIssue" className='links' ><button className='report_btn'>{t('report Issue')}</button></Link>}
        <RiMenu2Line className='icon_menu' onClick={toggleDrawer('bottom', true)} />
        <div className="lang" onClick={(e) => {changeLanguage(e.target.value)}}>
          <select>
            <option value="en">English</option>
            <option value="ka">ಕನ್ನಡಿ</option>
          </select>
        </div>
        </div>
      </div>


      <div>
        <React.Fragment >
          {/* <button onClick={toggleDrawer('bottom', true)}>bottom</button> */}
          <SwipeableDrawer
            anchor='bottom'
            open={state['bottom']}
            onClose={toggleDrawer('bottom', false)}
            onOpen={toggleDrawer('bottom', true)}
          >
            {list('bottom')}
          </SwipeableDrawer>
        </React.Fragment>
        
    </div>
      <ToastContainer />
    </>
  )
}
export default Header
