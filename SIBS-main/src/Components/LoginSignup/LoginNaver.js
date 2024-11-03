import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginNaver = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNaverUserData = async () => {
            const code = new URL(document.location.toString()).searchParams.get('code');
            const state = localStorage.getItem('oauth_state');

            if (!code) {
                console.error('Authorization code not found in URL');
                return;
            }

            try {

                const response = await axios.get('http://localhost:5000/naver-oauth', {
                    params: { code, state },
                });

                const userData = response.data;
                console.log('Naver API response:', userData);

                if (userData.response) {
                    const userInfo = {
                        name: userData.response.name || 'Unknown',
                        email: userData.response.email || 'Unknown',
                    };

                    console.log('Parsed Naver user data:', userInfo);


                    navigate('/login', { state: { ...userInfo, action: "Sign Up" } });
                } else {
                    console.error('Invalid response structure:', userData);
                }
            } catch (error) {
                console.error('Error fetching Naver user data:', error);
            }
        };

        fetchNaverUserData();
    }, [navigate]);

    return (
        <div>
            <h1>Naver Login Callback</h1>
            <p>Loading user information...</p>
        </div>
    );
};

export default LoginNaver;
