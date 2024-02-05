// UrlShortenerBox.js
import React, { useState,useRef,useEffect } from 'react';
import '../Styles/UrlShortenerBox.css';
import LinkIcon from '@mui/icons-material/Link';
import Box from '@mui/material/Box'
import axios from 'axios'
import { Button, Hidden } from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Drawer from '@mui/material/Drawer';
import InfiniteScrollList from './InfiniteScrollList';
const backend_url = 'https://srt-u4or.onrender.com'//  'http://localhost:8754'


const UrlShortenerBox = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [error, setError] = useState(null)
  const [shorted, setShorted] = useState(false)
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [urlList,setUrlList ] = useState([])
  const [totalClick,setTotalClicks] = useState(0)

  useEffect(()=>{
    fetchAnalytics()
  },[])

  const fetchAnalytics = ()=>{
    const config = {
      method: 'get',
      url: backend_url + '/api/v1/url-analytics/0/0',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    axios(config)
      .then(function (response) {
        const result = response.data
        setTotalClicks(result.data[0]['total_click_count']) 
      })
      .catch(function (error) {
        if (error.response && error.response.status === 429) {
          setErrorMessage('Too Many Requests. Please try again later.');
        }
      });
  }



  const handleTogglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const callUrlShortener = () => {
    const data = JSON.stringify({
      "long_url": originalUrl
    });

    const config = {
      method: 'post',
      url: backend_url + '/api/v1/shorten-url',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };
    axios(config)
      .then(function (response) {
        const result = response.data
        setShortenedUrl(result.data[0]['short_url'])
        setShorted(true)
        setSuccessMessage('URL successfully shortened!');
        setErrorMessage(''); 
      })
      .catch(function (error) {
        if (error.response && error.response.status === 429) {
          setErrorMessage('Too Many Requests. Please try again later.');
        }
      });
  }
  const shortenAnotherUrl = () => {
    setShorted(false)
    setOriginalUrl('')
    setShortenedUrl('')
    setErrorMessage('')
    setSuccessMessage('')
  }

  const shortenUrl = () => {
    
    if (!originalUrl.length) {
      return;
    }

    // Regular expression for a valid URL
    const urlRegex = /\./;

    if (originalUrl.length === 1 || !urlRegex.test(originalUrl)) {
      setErrorMessage("Invalid URL.");
    } else {
      if (!originalUrl.startsWith('http://') && !originalUrl.startsWith('https://')) {
        const originalUrlTemp = 'http://' + originalUrl;
        setOriginalUrl(originalUrlTemp);
        setErrorMessage('');
      }
     
      callUrlShortener();
      
    }

  }

  const copyToClipboard = () => {
    if (shortenedUrl) {
      navigator.clipboard.writeText(shortenedUrl);
      setSuccessMessage('URL copied to clipboard!');
      setErrorMessage(''); 
    }
  };
  

  return (
    <>
    <AppBar position="static" style={{backgroundColor:"#2c4a6a"}}>
        <Toolbar>
          <h4>{"   Total Clicks :" + totalClick }</h4>
          <Button style={{backgroundColor:'white',color:'#2c4a6a',left:'100px' }} onClick={handleTogglePanel}>
            My URLs
          </Button>
        </Toolbar>
      </AppBar>
      <div className="url-shortener-box">
      
      <Box style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'left' 
        }}>
        <Box style={{ 
          fontSize: '25px', 
          color: '#2c4a6a', 
          top: '10px', 
          marginRight: '10px' 
          }}>
            <LinkIcon fontSize="large" />
            </Box>
        <span className="url-input"> Paste your URL</span>
      </Box>
      <input
        type="text"
        id="url-input"
        placeholder="Enter Long URL"
        value={originalUrl}
        disabled={shorted}
        onChange={(e) => setOriginalUrl(e.target.value)}
      />

      <input
        type="text"
        id="url-input"
        placeholder="Short URL "
        value={shortenedUrl === '' ? '' : shortenedUrl}
        disabled={true}
      />
      
      <Button
        variant="contained"
        color="primary"
        startIcon={<FileCopyIcon />}
        onClick={copyToClipboard}
        style={{ width: '100px', height: '30px', top: '-110px', left: '-120px', backgroundColor: 'green' ,visibility: !shorted ? 'hidden' : 'visible',}}
       
      >
        copy
      </Button>
      {successMessage && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="success.main"
          marginTop={-35}
          padding={10}
        >
          <CheckCircleOutlineIcon sx={{ marginRight: 1 }} />
          {successMessage}
        </Box>
      )}
      {errorMessage && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="error.main"
          marginTop={-25}
          padding={1}
        >
          <ErrorOutlineIcon sx={{ marginRight: 1 }} />
          {errorMessage}
        </Box>
      )}

      {shorted == false ? (errorMessage != '' ? 
      <Button style={{  top: '-100px' }} onClick={shortenUrl}>SHORTEN  URL</Button> : 
      <Button style={{ top: '-260px' }} onClick={shortenUrl}>SHORTEN  URL</Button>) : 
      <Button onClick={shortenAnotherUrl}>SHORTEN ANOTHER URL</Button>}
     

    </div>
    <Drawer anchor="right" open={isPanelOpen} onClose={handleTogglePanel}>
        <div style={{ width: '700px' }}>
          <InfiniteScrollList dataList={urlList}/>
        </div>
      </Drawer>
    </>
   
  );

};

export default UrlShortenerBox;
