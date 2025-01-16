import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

const NotificationBell = ({ count }) => {
  return (
    <div className="relative inline-block border p-1 cursor-pointer shadow-sm">
      {/* Bell Icon */}
      <FontAwesomeIcon
        icon={faBell}
        className="w-4 h-3 text-gray-700"
      />
      
      {/* Notification Badge */}
      {count > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full -translate-x-1 translate-y-1 mt-[-4px] mr-[-4px]">
          {count}
        </span>
      )}
    </div>
  );
};

export default NotificationBell

