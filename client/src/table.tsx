import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Outlet } from 'react-router-dom';
import {
  UserOutlined,
  HomeOutlined,
  SettingOutlined,
  BookOutlined,
} from '@ant-design/icons';
import {
  Button,
  ConfigProvider,
  Flex,
  Layout,
  Menu,
  Popover,
  Switch,
  theme,
} from 'antd';
import Tags from './tags';
import Contents from './contents';
import { useTranslation } from 'react-i18next';
import zhCN from 'antd/lib/locale/zh_CN';
import enUS from 'antd/lib/locale/en_US';
import studyNotes from './studyNotes';

const { Header, Content, Sider } = Layout;

const Table: React.FC = () => {
  const [lang, setlang] = useState('zh');

  const { t, i18n } = useTranslation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const location = useLocation();

  const getMenuSelectedKeys = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    console.log(paths);
    let currentPath = paths.join('-');
    console.log(currentPath);
    if (!currentPath) currentPath = '1';
    else if (currentPath.includes('welcome')) currentPath = '1';
    else if (currentPath.includes('grade')) currentPath = '2';
    else if (currentPath.includes('user')) currentPath = '3';
    else currentPath = '1';
    return [currentPath];
  };

  const getLang = () => {
    fetch('./api/lang')
      .then(res => res.json())
      .then(data => {
        setlang(data.data);
        i18n.changeLanguage(data.data, (err, t) => {});
      });
  };

  const toggleLang = () => {
    fetch('./api/lang', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lang: lang === 'zh' ? 'en' : 'zh' }),
    }).then(res => {
      // getLang();
    });
  };

  const keepLang = () => {
    fetch('./api/lang')
      .then(res => res.json())
      .then(data => {
        localStorage.setItem('lang', data.data);
      });
  };
  // keepLang();

  const onLogOut = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Layout>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#fff',
          fontSize: '24px',
        }}
      >
        <h3
          onClick={() => {
            window.location.href = '/table/welcome';
          }}
          style={{
            cursor: 'pointer',
          }}
        >
          {t('四六级考试管理平台')}
        </h3>
        <Popover
          content={
            <Button type="primary" onClick={onLogOut}>
              {t('退出系统')}
            </Button>
          }
        >
          <UserOutlined />
        </Popover>
      </Header>
      <Layout>
        <Sider collapsible={true} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            selectedKeys={getMenuSelectedKeys()} // 根据路由动态设置选中项
            style={{ height: '100%', borderRight: 0 }}
            items={[
              {
                icon: <HomeOutlined />,
                key: 1,
                label: <Link to="/table/welcome">{t('首页')}</Link>,
              },
              {
                icon: <BookOutlined />,
                key: 2,
                label: <Link to="/table/grade">{t('成绩管理')}</Link>,
              },
              {
                icon: <UserOutlined />,
                key: 3,
                label: <Link to="/table/user">{t('用户管理')}</Link>,
              },
            ]}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <ConfigProvider locale={lang === 'zh' ? zhCN : enUS}>
              {/* <Routes>
                <Route path="/index.html" Component={studyNotes} />
                <Route path="/" Component={studyNotes} />
                <Route path="/notes" Component={studyNotes} />
                <Route path="/contents" Component={Contents} />
                <Route path="/tags" Component={Tags} />
              </Routes> */}
              <Outlet />
            </ConfigProvider>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Table;
