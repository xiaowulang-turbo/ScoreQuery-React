import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  BarChartOutlined,
  TagsOutlined,
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
    let currentPath = paths.join('-');
    if (!currentPath) currentPath = '1';
    else if (currentPath === 'notes') currentPath = '1';
    else if (currentPath === 'contents') currentPath = '2';
    else if (currentPath === 'tags') currentPath = '3';
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
      getLang();
    });
  };

  const keepLang = () => {
    fetch('./api/lang')
      .then(res => res.json())
      .then(data => {
        localStorage.setItem('lang', data.data);
      });
  };
  keepLang();

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
        <h3>{t('Header Title')}</h3>
        <Popover
          trigger="click"
          content={
            <Switch
              checkedChildren="中文"
              unCheckedChildren="EN"
              onClick={() => toggleLang()}
            ></Switch>
          }
        >
          <Flex gap={5}>
            <ConfigProvider wave={{ disabled: true }}>
              <Button
                icon={<SettingOutlined />}
                style={{ background: 'none', border: 'none', color: '#fff' }}
              >
                {t('Setting')}
              </Button>
            </ConfigProvider>
          </Flex>
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
                icon: <BookOutlined />,
                key: 1,
                label: <Link to="/notes">{t('Menu Item Notes')}</Link>,
              },
              {
                icon: <BarChartOutlined />,
                key: 2,
                label: <Link to="/contents">{t('Menu Item Content')}</Link>,
              },
              {
                icon: <TagsOutlined />,
                key: 3,
                label: <Link to="/tags">{t('Menu Item Tags')}</Link>,
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
              <Routes>
                <Route path="/index.html" Component={studyNotes} />
                <Route path="/" Component={studyNotes} />
                <Route path="/notes" Component={studyNotes} />
                <Route path="/contents" Component={Contents} />
                <Route path="/tags" Component={Tags} />
              </Routes>
            </ConfigProvider>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Table;
