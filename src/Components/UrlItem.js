
import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { formatDistanceToNow } from 'date-fns';

const UrlListItem = ({ shortUrl, longUrl, visitedCount, createdAt }) => {
    const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  return (
    
    <Paper elevation={0} style={{ padding: '20px', margin: '20px', width: '600px', border:'0.1px solid black' }}>
     
      <Box component="div" display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <div style={{ color: '#2c4a6a', fontWeight: 'bold', fontSize: '16px' }}>{shortUrl}</div>
      </Box>

     
      <Box
        component="div"
        style={{
          color: '#333',
          marginBottom: '10px',
          fontSize: '14px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {longUrl}
      </Box>

      
      <Box component="div" style={{ fontSize: '15px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ color: '#3498DB' }}>Visited Count: {visitedCount} | Created  {timeAgo} </div>
       
      </Box>
    </Paper>
  );
};

export default UrlListItem;

