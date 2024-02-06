import React, { useEffect, useState } from 'react';
import { useParams, Redirect, Navigate } from 'react-router-dom'; 
import axios from 'axios';
const backend_url = 'https://srt-u4or.onrender.com'//  'http://localhost:8754'


const RedirectComponent = () => {
    const { short_url } = useParams(); 
    const [originalUrl, setOriginalUrl] = useState(null);

    useEffect(() => {
        var config = {
            method: 'get',
            url: backend_url + '/api/v1/long-url/' + short_url,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        axios(config)
            .then(function (response) {
                const result = response.data
                setOriginalUrl(result.data[0]['long_url'])
                window.location.href = result.data[0]['long_url']
                //Navigate()
            })
            .catch(function (error) {
                console.log(error);
            });

    }, []);

    
    // if (originalUrl) {
    //     window.location.href = originalUrl
    // }
};

export default RedirectComponent;
