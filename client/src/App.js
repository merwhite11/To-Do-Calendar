import React, {useState, useEffect, Suspense} from 'react';
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios'
import Home from './components/Home.jsx';
import { example } from './../../database/example.js'
const Registration  = React.lazy(() => import('./components/authentication/Registrationv2.jsx'));
const Login  = React.lazy(() => import('./components/authentication/Login.jsx'));

function App() {
  const [currentPage, changePage] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const homePage = (
    <Home
      setIsLoading={setIsLoading}
      isMobile={isMobile}
      isLoggedIn={isLoggedIn}
      setIsLoggedIn={setIsLoggedIn}
      isLoading={isLoading}
    />
  );

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={homePage} />
          <Route path="/signin" element={
            <Suspense fallback={<div>Loading...</div>}>
              <Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            </Suspense>
          } />
          <Route path="/signup" element={
            <Suspense fallback={<div>Loading...</div>}>
              <Registration />
            </Suspense>
          } />
        </Routes>
      </Router>
    </div>
  );
}
export default App;
