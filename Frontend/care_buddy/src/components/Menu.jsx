import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import "./css/nav.css"

const Menu = ({ menuData }) => {
    const menuRef = useRef();
    const [openDropdown, setOpenDropdown] = useState(null);
    const [hoveredSublist, setHoveredSublist] = useState(null);
    const location = useLocation(); // Get current location

    // Helper function to check if a menu or its submenus/children are active
    const isMenuActive = (menu) => {
        if (menu.path === location.pathname) return true; // Direct match for parent menu
        if (menu.submenu) {
            // Check submenus and their children
            return menu.submenu.some((sub) => {
                if (sub.path === location.pathname) return true; // Match for submenu
                if (sub.children) {
                    // Match for submenu children
                    return sub.children.some((child) => child.path === location.pathname);
                }
                return false;
            });
        }
        return false;
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenDropdown(null);
                setHoveredSublist(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex space-x-6" ref={menuRef}>
            {menuData?.map((menu, index) => (
                <div
                    key={index}
                    className="relative menuBtn"
                    onMouseEnter={() => menu.submenu && setOpenDropdown(index)}
                    onMouseLeave={() => setOpenDropdown(null)}
                >
                    {/* Main Menu */}
                    <Link
                        to={menu.path || "#"} // Default to "#" if no path
                        className={`py-5 ${
                            isMenuActive(menu) ? "text-blue-500 font-bold navActiveCol" : ""
                        }`} // Highlight active menu if active or submenu is active
                        onClick={() => setOpenDropdown(null)}
                    >
                        {menu.title}
                        {menu.submenu && (
                            <FontAwesomeIcon icon={faChevronDown} className="text-sm ml-2" />
                        )}
                    </Link>

                    {/* Dropdown */}
                    {openDropdown === index && menu.submenu && (
                        <div
                            className="absolute bg-white text-gray-800 mt-3 py-4 rounded shadow-md whitespace-nowrap"
                            onMouseEnter={() => setOpenDropdown(index)}
                            onMouseLeave={() => setOpenDropdown(null)}
                        >
                            {menu.submenu.map((sub, idx) => (
                                <div
                                    key={idx}
                                    className="relative"
                                    onMouseEnter={() => setHoveredSublist(sub.title)}
                                    onMouseLeave={() => setHoveredSublist(null)}
                                >
                                    {/* Submenu without children */}
                                    {!sub.children ? (
                                        <Link
                                            to={sub.path}
                                            className={`block px-4 py-2 hover:bg-gray-100 ${
                                                sub.path === location.pathname ? "bg-gray-200 font-bold" : ""
                                            }`} // Highlight active submenu
                                            onClick={() => setOpenDropdown(null)}
                                        >
                                            {sub.title}
                                        </Link>
                                    ) : (
                                        /* Submenu with children */
                                        <>
                                            <button
                                                className="flex justify-between w-full text-left px-4 py-2 hover:bg-gray-100 items-center"
                                            >
                                                {sub.title}
                                                <FontAwesomeIcon
                                                    className="ml-4 text-sm"
                                                    icon={faChevronRight}
                                                    color="black"
                                                />
                                            </button>
                                            {hoveredSublist === sub.title && (
                                                <div
                                                    className="absolute left-full ml-0.5 top-0 bg-white text-gray-800 mt-0 rounded shadow-md whitespace-nowrap py-4"
                                                    onMouseEnter={() => setHoveredSublist(sub.title)}
                                                    onMouseLeave={() => setHoveredSublist(null)}
                                                >
                                                    {sub.children.map((child, childIdx) => (
                                                        <Link
                                                            key={childIdx}
                                                            to={child.path}
                                                            className={`block px-4 py-2 hover:bg-gray-100 ${
                                                                child.path === location.pathname
                                                                    ? "bg-gray-200 font-bold"
                                                                    : ""
                                                            }`} // Highlight active child
                                                            onClick={() => setOpenDropdown(null)}
                                                        >
                                                            {child.title}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Menu;
