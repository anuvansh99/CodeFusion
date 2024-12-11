import React, { useEffect, useState } from 'react';
import logo from '../images/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from 'react-avatar';
import { MdLightMode } from 'react-icons/md';
import { BsGridFill } from 'react-icons/bs';
import { api_base_url, toggleClass } from '../helper';

const Navbar = ({ isGridLayout, setIsGridLayout }) => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(api_base_url + '/getUserDetails', {
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: localStorage.getItem('userId'),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setData(data.user);
        } else {
          setError(data.message);
        }
      });
  }, []);

  const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    window.location.reload();
  };

  return (
    <div className="navbar flex flex-wrap items-center justify-between px-6 sm:px-12 lg:px-24 h-16 bg-[#141414] relative">
      <div className="logo flex-shrink-0">
        <img
          className="w-32 cursor-pointer"
          src={logo}
          alt="Logo"
          onClick={() => navigate('/')}
        />
      </div>

      <div className="links flex items-center gap-4 sm:gap-8">
        <span className="navbut">
          <Link to="/">Home</Link>
        </span>
        <span className="navbut">
          <Link to="/about">About</Link>
        </span>
        <button
          onClick={logout}
          className="btnBlue !bg-red-500 min-w-[100px] sm:min-w-[120px] ml-2 hover:!bg-red-600"
        >
          Logout
        </button>
        <Avatar
          onClick={() => {
            toggleClass('.dropDownNavbar', 'hidden');
          }}
          name={data ? data.name : ''}
          size="40"
          round="50%"
          className="cursor-pointer ml-2"
        />
      </div>

      {/* Dropdown for Avatar */}
      <div className="dropDownNavbar hidden absolute right-6 sm:right-10 top-16 shadow-lg shadow-black/50 p-4 rounded-lg bg-[#1A1919] w-40 h-28">
        <div className="py-2 border-b border-white">
          <h3 className="text-sm sm:text-base" style={{ lineHeight: 1 }}>
            {data ? data.name : ''}
          </h3>
        </div>
        <i
          onClick={() => setIsGridLayout(!isGridLayout)}
          className="flex items-center gap-2 mt-3 mb-2 cursor-pointer"
          style={{ fontStyle: 'normal' }}
        >
          <BsGridFill className="text-lg" /> {isGridLayout ? 'List' : 'Grid'} layout
        </i>
      </div>
    </div>
  );
};

export default Navbar;
