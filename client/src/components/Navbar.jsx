import React, { useState, useContext, useEffect, useRef } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import logo from "./images/logo.png";
import { AuthContext } from "../auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff, faPalette } from "@fortawesome/free-solid-svg-icons";
import { postData } from "../auth/Methods";
import darkLogo from "./images/darkLogo.png";
import userAvatar from "./images/userAvatar.png";
import "./css/nav.css";
import SearchBar from "../components/SearchBar";
import NotificationBell from "./NotificationBell";
import Svg from "./Svg";
import MenuBar from "./MenuBar";
import UserDrop from "./UserDrop";

const Navbar = () => {
  const location = useLocation();
  const { user, setAccessToken } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [openThemeDropdown, setOpenThemeDropdown] = useState(false);
  const navigate = useNavigate();
  const [currentTheme, setCurrentTheme] = useState("light");
  const dropdownRef = useRef(null); // Ref for the dropdown container

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.classList.add(savedTheme);
    setCurrentTheme(savedTheme);
  }, []);

  useEffect(() => {
    // Function to handle click outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Add event listener when the dropdown is open
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]); // Only re-run if isOpen changes

  if (location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/verify" || location.pathname === "/reset-password") {
    return null;
  }

  const handleLogout = async () => {
    let resp = await postData("/auth/logout", {}, { withCredentials: true });
    localStorage.removeItem("accessToken");
    setAccessToken(null);
    navigate("/login");
  };

  const handleThemeChange = (theme) => {
    document.body.classList.remove("light", "dark", "theme3", "theme4");
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
    setCurrentTheme(theme);
    setOpenThemeDropdown(false);
  };

  const requestFullScreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      requestFullScreen();
    } else {
      exitFullScreen();
    }
  };

  return (
    <>
      <nav className="h-16 flex bg-[var(--bgCol)] top-0 items-center justify-between px-8 py-2 w-full navbar fixed z-10">
        <div className="flex gap-4">
          <Link to="/" className="text-xl font-bold flex items-center gap-2">
            <img
              src={
                currentTheme === "light" || currentTheme === "theme4"
                  ? logo
                  : darkLogo
              }
              className="max-h-8"
              alt="Logo"
            />
            <div className="text-lg">Care Buddy</div>
          </Link>
          <SearchBar />
        </div>

        <div className="flex gap-4 h-[80%] items-center">
          {/* <Svg
            type="language"
            className="icons border px-3 py-1 cursor-pointer shadow-sm h-[80%] rounded-sm "
            color='var(--iconCol)'
          /> */}

          {currentTheme === "dark" ? (
            <Svg
              onClick={() => handleThemeChange("light")}
              type="sun"
              className="icons border px-3 py-1 cursor-pointer shadow-sm h-[80%] rounded-sm "
              color='var(--iconCol)'
            />
          ) : (
            <Svg
              type="moon"
              onClick={() => handleThemeChange("dark")}
              className="icons border px-3 py-1 cursor-pointer shadow-sm h-[80%] rounded-sm "
              color='var(--iconCol)'
            />
          )}

          <Svg
            type="bell"
            className="icons border px-3 py-1 cursor-pointer shadow-sm h-[80%] rounded-sm "
            color='var(--iconCol)'
          />

          <Svg
            onClick={toggleFullScreen}
            type="fullscreen"
            className="icons border px-3 py-1 cursor-pointer shadow-sm h-[80%] rounded-sm "
            color='var(--iconCol)'
          />

          <div  className="icons border cursor-pointer shadow-sm h-10 w-10 object-cover overflow-hidden rounded-full" onClick={()=>navigate('/profile')}>
            <img
              src={user == null ? userAvatar : (user?.profilePic === null ? userAvatar : user?.profilePic)}
              alt="profile pic"
              className="h-full w-full object-cover"
            />
          </div>
          <div ref={dropdownRef} className="h-[100%] flex items-center" onClick={() => setIsOpen(!isOpen)}>
            {isOpen && <UserDrop user={user} />}
          <Svg
            type="settings"
            className="icons border px-3 py-1 cursor-pointer shadow-sm h-[80%] rounded-sm "
            color='var(--iconCol)'
          />
          </div>
          
        </div>
      </nav>

      <MenuBar user={user} />
    </>
  );
};

export default Navbar;