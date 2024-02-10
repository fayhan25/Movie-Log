import {useState, useCallback, useEffect} from 'react';
let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState();
  const [tokenExpirationDate, setTokenExpirationDate]=useState();
  const [userId, setUserId] = useState();
  
  const login = useCallback ((uid,myToken,expirationDate) => {
    setToken(myToken);
    setUserId(uid);
    let tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 *60 *60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem('userData', JSON.stringify({userId:uid, token:myToken, expiration: tokenExpirationDate.toISOString()}))
  }, []);

  const logout = useCallback (() => {
    setToken(null);
    setUserId(null);
    setTokenExpirationDate(null);
    localStorage.removeItem('userData')
  }, []);

  useEffect(()=>{
    if (token && tokenExpirationDate){
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout,remainingTime);
    }
    else{
      clearTimeout(logoutTimer);
    }
  },[logout,tokenExpirationDate,token]);
  useEffect(()=>{
    const storeData = JSON.parse(localStorage.getItem('userData'));
    if (storeData && storeData.token && new Date(storeData.expiration > new Date())){
      login(storeData.userId, storeData.token, new Date(storeData.expiration));
    }
  },[login]);
  
  return {token, login, logout, userId};
}