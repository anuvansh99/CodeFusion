import React from 'react';
import logo from '../images/logo.png';
import { FiDownload } from 'react-icons/fi';

const EditiorNavbar = ({ proj }) => {
  return (
    <div className="EditiorNavbar flex flex-wrap items-center justify-between px-6 sm:px-12 lg:px-24 h-16 bg-[#141414]">
      {/* Logo */}
      <div className="logo flex-shrink-0">
        <img
          className="w-28 sm:w-36 cursor-pointer"
          src={logo}
          alt="Logo"
        />
      </div>

      {/* Project ID */}
      <p className="text-sm sm:text-base text-white truncate">
        Project ID: {proj}
      </p>

      {/* Download Icon */}
      <i
        className="p-2 sm:p-3 btn bg-black rounded-md cursor-pointer text-lg sm:text-xl"
        title="Download Project"
      >
        <FiDownload />
      </i>
    </div>
  );
};

export default EditiorNavbar;
