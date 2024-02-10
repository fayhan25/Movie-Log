import {React, useState, useCallback, useEffect} from 'react';
import { BrowserRouter as Router, Route,Navigate, Routes} from 'react-router-dom';

import Movies from './movies/pages/Movies';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import Users from './user/pages/User';
import UserMovies from './movies/pages/UserMovies';
import UpdateMovies from './movies/pages/UpdateMovies';
import Auth from './user/pages/Auth';
import { AuthContext } from './shared/components/context/auth-context';
let logoutTimer;
const App = () => {
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
  },[logout,tokenExpirationDate]);
  useEffect(()=>{
    const storeData = JSON.parse(localStorage.getItem('userData'));
    if (storeData && storeData.token && new Date(storeData.expiration > new Date())){
      login(storeData.userId, storeData.token, new Date(storeData.expiration));
    }
  },[login]);

  let routes;
  if (token){
    routes = (
      <Router>
      <MainNavigation/>
        <main>
        <Routes>
          <Route path= "/" element = {<Users/>}/>
          <Route path = "/:userId/movies" element = {<UserMovies/>}/>
          <Route path = "/movies/new" element = {<Movies/>}/>    
          <Route path = "movies/:movieId" element = {<UpdateMovies/>} />
          <Route
              path="*"
              element={<Navigate to="/" replace />}
          />
        </Routes>
        </main>
      </Router>
    )
  }
  else{
    routes = (
      <Router>
      <MainNavigation/>
        <main>
        <Routes>
          <Route path= "/" element = {<Users/>}/>
          <Route path = "/auth" element = {<Auth/>} />
          <Route
              path="*"
              element={<Navigate to="/" replace />}
          />
        </Routes>
        </main>
      </Router>
    )
  }
  return (
    <AuthContext.Provider value={{userId,isLoggedIn: !!token, token:token, login, logout}}>
      {routes}
    </AuthContext.Provider>
  );
}

export default App;
