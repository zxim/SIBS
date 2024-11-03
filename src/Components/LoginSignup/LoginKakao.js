import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginKakao = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKakaoUserData = async () => {
      const KAKAO_TOKEN_URL = 'https://kauth.kakao.com/oauth/token';
      const KAKAO_USER_INFO_URL = 'https://kapi.kakao.com/v2/user/me';

      const code = new URL(document.location.toString()).searchParams.get('code');
      if (!code) {
        console.error('Authorization code not found in URL');
        return null;
      }

      try {
        const { data: tokenData } = await axios.post(KAKAO_TOKEN_URL, null, {
          params: {
            grant_type: 'authorization_code',
            redirect_uri: process.env.REACT_APP_REDIRECT_URI,
            client_id: process.env.REACT_APP_REST_API_KEY,
            code,
            client_secret: process.env.REACT_APP_CLIENT_SECRET,
          },
        });

        const accessToken = tokenData.access_token;
        console.log('Access Token:', accessToken);

        const { data: userData } = await axios.get(KAKAO_USER_INFO_URL, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log('Kakao API response:', userData);

        const userInfo = {
          name: userData.kakao_account?.name || 'Unknown',
          email: userData.kakao_account?.email || 'Unknown',
        };

        console.log('Parsed Kakao user data:', userInfo);

        // Sign Up 탭을 표시하기 위해 LoginSignup으로 userInfo 전달
        navigate('/login', { state: { ...userInfo, action: "Sign Up" } });

        return userInfo;
      } catch (error) {
        if (error.response) {
          console.error('Error response:', error.response.data);
          console.error('Error status:', error.response.status);
          console.error('Error headers:', error.response.headers);
        } else if (error.request) {
          console.error('Error request:', error.request);
        } else {
          console.error('General Error:', error.message);
        }
        return null;
      }
    };

    fetchKakaoUserData();
  }, [navigate]);

  return (
    <div>
      <h1>Kakao Login Callback</h1>
      <p>Loading user information...</p>
    </div>
  );
};

export default LoginKakao;
