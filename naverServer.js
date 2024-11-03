require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());

app.get('/naver-oauth', async (req, res) => {
    const { code, state } = req.query;

    console.log('Received code:', code);
    console.log('Received state:', state);

    const NAVER_TOKEN_URL = 'https://nid.naver.com/oauth2.0/token';
    const NAVER_USER_INFO_URL = 'https://openapi.naver.com/v1/nid/me';

    try {
  
        const tokenResponse = await axios.post(NAVER_TOKEN_URL, null, {
            params: {
                grant_type: 'authorization_code',
                client_id: process.env.REACT_APP_NAVER_CLIENT_ID,
                client_secret: process.env.REACT_APP_NAVER_CLIENT_SECRET,
                code,
                state,
            },
        });

        const tokenData = tokenResponse.data;
        console.log('Token Data:', tokenData);

        const accessToken = tokenData.access_token;
        console.log('Access Token:', accessToken);

        const userResponse = await axios.get(NAVER_USER_INFO_URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const userData = userResponse.data;
        console.log('User Data:', userData);

        res.json(userData);
    } catch (error) {
        console.error('Error during OAuth process:', error.message);
        if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            console.error('Error response headers:', error.response.headers);
        }
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
