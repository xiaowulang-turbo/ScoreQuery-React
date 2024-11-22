// NotFound.tsx
import { Button } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>404 Not Found</h1>
      <Button onClick={() => navigate('/table/welcome')}>返回首页</Button>
    </div>
  );
};

export default NotFound;
