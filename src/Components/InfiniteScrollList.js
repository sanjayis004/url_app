
import React, { useState, useEffect, useRef, useCallback } from 'react';
import UrlListItem from './UrlItem'; 
import axios from 'axios';
const backend_url = 'https://srt-u4or.onrender.com'//  'http://localhost:8754'

const InfiniteScrollList = ({ dataList }) => {
  const [data, setData] = useState([]); // Data fetched from the API
  const [page, setPage] = useState(1); // Current page
  const [loading, setLoading] = useState(false); // Loading indicator
  const panelRef = useRef();
  const [allDataLoaded, setAllDataLoaded] = useState(false);
  

  const fetchAllUrls = async (limit, offset) => {
  try {
    setLoading(true);
    const response = await axios.get(`${backend_url}/api/v1/url-analytics/${limit}/${offset}`);
    const newData = response.data?.data[0]?.visit_data || [];
    if (newData.length === 0) {
      setAllDataLoaded(true); // Set allDataLoaded to true when no more data is returned
    } else {
      setData((prevData) => [...prevData, ...newData]);
    }
    setLoading(false);
  } catch (error) {
    console.error('Error fetching data:', error);
    setLoading(false);
  }
};

const handleScroll = useCallback(() => {
  const panel = panelRef.current;
  if (panel.scrollTop + panel.clientHeight >= panel.scrollHeight && !loading) {
    // Increment page before making the API call
    setPage((prevPage) => prevPage + 1);
  }
}, [loading]);

useEffect(() => {
  const panel = panelRef.current;
  if (panel) {
    panel.addEventListener('scroll', handleScroll);
  }

  return () => {
    if (panel) {
      panel.removeEventListener('scroll', handleScroll);
    }
  };
  
}, [handleScroll]); 

useEffect(() => {
  
  fetchAllUrls(10, 0);
}, []); 

useEffect(() => {
  
 if (!allDataLoaded && page > 1) {
    fetchAllUrls(10, (page - 1) * 10);
  }
 
}, [page]);


  return (
    <div ref={panelRef} style={{ overflowY: 'scroll', height: '650px' }}>
      {data.map((item) => (
        <UrlListItem
          key={item.id}
          shortUrl={item.short_url}
          longUrl={item.long_url}
          visitedCount={item.visit_count}
          createdAt={item.date_created}
        />
      ))}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default InfiniteScrollList;

