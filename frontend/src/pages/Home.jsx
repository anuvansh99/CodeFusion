import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ListCard from '../components/ListCard';
import GridCard from '../components/GridCard';
import { api_base_url } from '../helper';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [projTitle, setProjTitle] = useState('');
  const navigate = useNavigate();
  const [isCreateModelShow, setIsCreateModelShow] = useState(false);

  const filteredData = data
    ? data.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const createProj = (e) => {
    if (projTitle === '') {
      alert('Please Enter Project Title');
    } else {
      fetch(api_base_url + '/createProject', {
        mode: 'cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: projTitle,
          userId: localStorage.getItem('userId'),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setIsCreateModelShow(false);
            setProjTitle('');
            alert('Project Created Successfully');
            navigate(`/editior/${data.projectId}`);
          } else {
            alert('Something Went Wrong');
          }
        });
    }
  };

  const getProj = () => {
    fetch(api_base_url + '/getProjects', {
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
          setData(data.projects);
        } else {
          setError(data.message);
        }
      });
  };

  useEffect(() => {
    getProj();
  }, []);

  const [userData, setUserData] = useState(null);
  const [userError, setUserError] = useState('');

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
          setUserData(data.user);
        } else {
          setUserError(data.message);
        }
      });
  }, []);

  const [isGridLayout, setIsGridLayout] = useState(false);

  return (
    <>
      <Navbar isGridLayout={isGridLayout} setIsGridLayout={setIsGridLayout} />
      <div className="flex flex-col sm:flex-row items-center justify-between px-6 sm:px-12 lg:px-24 my-6">
        <h2 className="text-lg sm:text-xl lg:text-2xl">Hi, {userData ? userData.username : ''} 👋</h2>
        <div className="flex items-center gap-2">
          <div className="inputBox w-full sm:w-72">
            <input
              type="text"
              placeholder="Search Here...!"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <button
            onClick={() => {
              setIsCreateModelShow(true);
            }}
            className="btnBlue rounded-md text-lg sm:text-xl px-3 py-2"
          >
            +
          </button>
        </div>
      </div>

      <div className="cards px-6 sm:px-12 lg:px-24">
        {isGridLayout ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => <GridCard key={index} item={item} />)
            ) : (
              <p>No projects found</p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => <ListCard key={index} item={item} />)
            ) : (
              <p>No projects found</p>
            )}
          </div>
        )}
      </div>

      {isCreateModelShow && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-11/12 sm:w-3/5 md:w-2/5 lg:w-1/4 bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl mb-4">Create New Project</h3>
            <div className="inputBox bg-gray-700 mb-4">
              <input
                onChange={(e) => setProjTitle(e.target.value)}
                value={projTitle}
                type="text"
                placeholder="Project Title"
                className="w-full"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={createProj}
                className="btnBlue flex-1 rounded-md py-2"
              >
                Create
              </button>
              <button
                onClick={() => setIsCreateModelShow(false)}
                className="btnBlue flex-1 rounded-md bg-gray-600 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
