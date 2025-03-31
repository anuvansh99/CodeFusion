import React, { useEffect, useState } from 'react';
import EditiorNavbar from '../components/EditiorNavbar';
import Editor from '@monaco-editor/react';
import { MdLightMode } from 'react-icons/md';
import { AiOutlineExpandAlt } from 'react-icons/ai';
import { api_base_url } from '../helper';
import { useParams } from 'react-router-dom';

const Editior = () => {
  const [tab, setTab] = useState('html');
  const [isLightMode, setIsLightMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [htmlCode, setHtmlCode] = useState('<h1>Hello world</h1>');
  const [cssCode, setCssCode] = useState('body { background-color: #f4f4f4; }');
  const [jsCode, setJsCode] = useState('// some comment');

  const { projectID } = useParams();

  const changeTheme = () => {
    document.body.classList.toggle('lightMode', !isLightMode);
    setIsLightMode(!isLightMode);
  };

  const run = () => {
    const completeContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preview</title>
        <style>${cssCode}</style>
      </head>
      <body>
        ${htmlCode}
        <script>${jsCode}</script>
      </body>
      </html>
    `;
    const iframe = document.getElementById('iframe');
    if (iframe) iframe.srcdoc = completeContent;
  };

  const saveProject = () => {
    fetch(`${api_base_url}/updateProject`, {
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: localStorage.getItem('userId'),
        projId: projectID,
        htmlCode,
        cssCode,
        jsCode,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.success ? 'Project saved successfully' : 'Something went wrong');
      })
      .catch((err) => {
        console.error('Error saving project:', err);
        alert('Failed to save project. Please try again.');
      });
  };

  useEffect(() => {
    fetch(`${api_base_url}/getProject`, {
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: localStorage.getItem('userId'),
        projId: projectID,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.project) {
          setHtmlCode(data.project.htmlCode);
          setCssCode(data.project.cssCode);
          setJsCode(data.project.jsCode);
        }
      })
      .catch((err) => console.error('Error fetching project data:', err));
  }, [projectID]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        saveProject();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [htmlCode, cssCode, jsCode]);

  useEffect(() => {
    run();
  }, [htmlCode, cssCode, jsCode, isExpanded]);

  return (
    <>
      <EditiorNavbar proj={projectID} />
      <div className="flex flex-col lg:flex-row">
        <div className={`left w-full ${isExpanded ? 'lg:w-full' : 'lg:w-1/2'}`}>
          <div className="tabs flex items-center justify-between gap-2 bg-[#1A1919] px-8 py-2">
            <div className="tabs flex gap-4">
              {['html', 'css', 'js'].map((language) => (
                <button
                  key={language}
                  onClick={() => setTab(language)}
                  className={`tab px-4 py-1 rounded ${tab === language ? 'bg-gray-700 text-white' : 'bg-gray-900 text-gray-400'
                    }`}
                >
                  {language.toUpperCase()}
                </button>
              ))}
              <button
                onClick={saveProject}
                className="btn px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
            </div>
            <div className="flex items-center gap-4">
              <MdLightMode
                className="text-2xl cursor-pointer"
                onClick={changeTheme}
              />
              <AiOutlineExpandAlt
                className="text-2xl cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
              />
            </div>
          </div>
          <Editor
            height="82vh"
            theme={isLightMode ? 'vs-light' : 'vs-dark'}
            language={tab === 'html' ? 'html' : tab === 'css' ? 'css' : 'javascript'}
            value={tab === 'html' ? htmlCode : tab === 'css' ? cssCode : jsCode}
            onChange={(value) => {
              const code = value || ''; // Ensure value is not undefined
              if (tab === 'html') setHtmlCode(code);
              if (tab === 'css') setCssCode(code);
              if (tab === 'js') setJsCode(code);
            }}
          />


        </div>
        {!isExpanded && (
          <iframe
            id="iframe"
            className="w-full lg:w-1/2 min-h-[82vh] bg-white text-black"
            title="Output"
          />
        )}
      </div>
    </>
  );
};

export default Editior;
