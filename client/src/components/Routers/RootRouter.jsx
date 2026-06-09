import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';

import App from '../App';
import Login from '../Auth/Login';
import Register from '../Auth/Register';
import { loggedInStatusChanged } from '../../actions/authActions';
import { setNavigator } from '../../lib/history';

function NavigatorSetter() {
  const navigate = useNavigate();
  useEffect(() => { setNavigator(navigate); }, [navigate]);
  return null;
}

function PrivateRoute({ authStatus, children }) {
  return authStatus ? children : <Navigate to="/login" />;
}

export function RootRouter({ loggedIn, loggedInStatusChanged }) {
  useEffect(() => {
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
      loggedInStatusChanged(true);
    } else {
      loggedInStatusChanged(false);
    }
  }, []);

  return (
    <BrowserRouter>
      <NavigatorSetter />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={
          <PrivateRoute authStatus={loggedIn}>
            <App />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

const mapStateToProps = state => ({ loggedIn: state.auth.loggedIn });
export default connect(mapStateToProps, { loggedInStatusChanged })(RootRouter);
