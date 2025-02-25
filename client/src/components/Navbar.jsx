import React, { useState, useContext, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import logo from "./images/logo.png";
import { AuthContext } from "../auth/AuthContext";
// import menuData from "./menuData"; // Import the dynamic menu data
// import Menu from "./Menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff, faPalette } from "@fortawesome/free-solid-svg-icons"; // Change to faPalette
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

  const [openThemeDropdown, setOpenThemeDropdown] = useState(false); // State for theme dropdown
  const navigate = useNavigate();

  const [currentTheme, setCurrentTheme] = useState("light"); // State for current theme

  useEffect(() => {
    // Get theme from localStorage or set to default
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.classList.add(savedTheme);
    setCurrentTheme(savedTheme);
    console.log("hiii");
    console.log("user is",user)
  }, []);

  if (location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/verify") {
    return null; // Do not render Navbar on login page
  }

  const handleLogout = async () => {
    let resp = await postData("/auth/logout", {}, { withCredentials: true });
    console.log(resp);
    localStorage.removeItem("accessToken");
    setAccessToken(null);
    navigate("/login");
  };

  const handleThemeChange = (theme) => {
    // Remove all theme-related classes from body
    document.body.classList.remove("light", "dark", "theme3", "theme4");
    // Add the selected theme class
    document.body.classList.add(theme);
    // Save theme to localStorage
    localStorage.setItem("theme", theme);
    setCurrentTheme(theme);
    setOpenThemeDropdown(false); // Close the dropdown after selecting a theme
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
        <Svg
          type="language"
          className="icons border px-3 py-1 cursor-pointer shadow-sm h-[80%] rounded-sm "
            color='var(--iconCol)'
        />

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
          type="fullscreen"
          className="icons border px-3 py-1 cursor-pointer shadow-sm h-[80%] rounded-sm "
            color='var(--iconCol)'
        />

        <div className="icons border cursor-pointer shadow-sm h-9 w-9 object-cover overflow-hidden rounded-full" onClick={()=>setIsOpen(!isOpen)}>
          <img
            // src={user?.profilePic === null ? userAvatar : user?.profilePic}
            src={user==null ? userAvatar:(user?.profilePic===null?userAvatar:user?.profilePic)}
            alt="profile pic"
            className=""
          />

{isOpen && <UserDrop user={user}/> }
    
        </div>

        <Svg
          type="settings"
          className="icons border px-3 py-1 cursor-pointer shadow-sm h-[80%] rounded-sm "
            color='var(--iconCol)'
        />
      </div>
    </nav>

    
    <MenuBar/>
    </>

  );
};

export default Navbar;
