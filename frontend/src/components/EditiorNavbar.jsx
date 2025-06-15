import React from 'react';
import logo from '../images/logo.png';
import { useNavigate } from 'react-router-dom';

const EditiorNavbar = ({ proj }) => {
  const navigate = useNavigate();

  return (
    <div className="EditiorNavbar relative flex flex-wrap items-center justify-between px-6 sm:px-12 lg:px-24 h-16 bg-[#141414]">
      {/* Logo */}
      <div className="logo flex-shrink-0 z-10">
        <img
          className="w-28 sm:w-36 cursor-pointer"
          src={logo}
          alt="Logo"
          onClick={() => navigate('/')}
        />
      </div>

      {/* Project ID centered absolutely */}
      <p className="absolute left-0 right-0 mx-auto text-center w-max text-sm sm:text-base text-white truncate z-0">
        Project ID: {proj}
      </p>

      {/* Right side placeholder for spacing */}
      <div className="w-28 sm:w-36" />
    </div>
  );
};

export default EditiorNavbar;
