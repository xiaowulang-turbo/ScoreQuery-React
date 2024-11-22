import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Login from './pages/login';
// import Home from './pages/Home';
// import NotFound from './pages/NotFound';
// import UserPage from './pages/UserPage';
import { isAuthenticated, isStudent } from './utils/auth';
import Table from './table';
import Grade from './pages/grade';
import User from './pages/user';
import Query from './pages/query';
import Welcome from './pages/welcome';
import NotFound from './pages/notFound';

const AppRoutes = () => {
  const role = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* 未登录时跳转到 login */}
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              <Navigate to="/table/" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={
            isStudent() ? (
              <Navigate to="/query" />
            ) : isAuthenticated() ? (
              <Navigate to={'/table/welcome'} />
            ) : (
              <Login />
            )
          }
        />

        <Route path="/query" element={<Query />} />

        {/* 主页路由嵌套 */}
        <Route
          path="/table/*"
          element={isAuthenticated() ? <Table /> : <Navigate to="/login" />}
        >
          <Route path="grade" element={<Grade />} />
          <Route path="user" element={<User />} />
          <Route path="welcome" element={<Welcome />} />
          <Route path="*" element={<Welcome />} />
        </Route>

        {/* 未匹配路由 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
