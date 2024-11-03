import axios from 'axios';

export const googleOAuthHandler = () => {
  const googleOAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=291815217838-rs2shve1q824p135226rob4nm0pt5o95.apps.googleusercontent.com&response_type=token&redirect_uri=http://localhost:3000/login&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`;
  window.location.assign(googleOAuthURL);
};

export const fetchGoogleUserData = async () => {
  const url = new URL(window.location.href);
  const hash = url.hash;
  if (hash) {
    const accessToken = new URLSearchParams(hash.substring(1)).get('access_token');
    try {
      const response = await axios.get(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`, {
        headers: {
          authorization: `Bearer ${accessToken}`,
          accept: 'application/json',
        },
      });
      console.log('Google API response:', response.data);  // 전체 응답을 확인
      const { name, email } = response.data;
      window.history.replaceState({}, document.title, "/login"); // URL 정리
      return { name, email };
    } catch (error) {
      console.error('OAuth token expired or failed to fetch user data:', error);
    }
  }
  return null;
};

