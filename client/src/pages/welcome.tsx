import React, { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Avatar,
  Typography,
  Divider,
  List,
  Input,
  Button,
  message,
  Calendar,
} from 'antd';
import {
  UserOutlined,
  SmileOutlined,
  PlusOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface User {
  name: string;
  role: string; // 学生或管理员
  avatar?: string;
}

const Welcome: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentTime, setCurrentTime] = useState(
    dayjs().format('YYYY-MM-DD HH:mm:ss')
  );
  const [quote, setQuote] = useState<string>('努力是成功的基石。');
  const [todos, setTodos] = useState<string[]>([
    '头像上传',
    '国际化支持',
    '管理员权限划分',
    '删除用户',
  ]);
  const [newTodo, setNewTodo] = useState('');

  const role = localStorage.getItem('token');

  // 获取用户信息
  useEffect(() => {
    fetch('http://localhost:3010/auth/users', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(() => message.error('无法获取用户信息'));
  }, []);

  // 获取每日一句
  useEffect(() => {
    fetch('https://api.quotable.io/random') // 示例接口，可替换为其他每日一句 API
      .then(res => res.json())
      .then(data => setQuote(data.content))
      .catch(() => message.warning('无法加载每日一句，使用默认值'));
  }, []);

  // 更新当前时间
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs().format('YYYY-MM-DD HH:mm:ss'));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 添加待办事项
  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, newTodo.trim()]);
      setNewTodo('');
      message.success('待办事项已添加！');
    } else {
      message.warning('请输入有效的待办事项');
    }
  };

  // 完成待办事项
  const completeTodo = (index: number) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
    message.success('待办事项已完成！');
  };

  return (
    <div>
      <Row gutter={[16, 16]} style={{ width: '100%' }}>
        {/* 用户信息卡片 */}
        <Col span={12} xs={12} md={12}>
          <Card bordered hoverable>
            <Avatar
              src={user?.avatar || 'https://www.loliapi.com/acg/pp/'}
              size={80}
              icon={<UserOutlined />}
              style={{ marginBottom: '20px' }}
            />
            <Title level={4}>欢迎，{role || '用户'}！</Title>
            <Text type="secondary">
              身份：{role === 'admin' ? '管理员' : '学生'}
            </Text>
            <Divider />
            <Text>当前时间：</Text>
            <Title level={5} style={{ color: '#1890ff' }}>
              {currentTime}
            </Title>
          </Card>
        </Col>
        {/* 待办事项 */}
        <Col span={12} xs={12}>
          <Card bordered hoverable>
            <Title level={4}>待办事项</Title>
            <List
              size="small"
              bordered
              dataSource={todos}
              renderItem={(item, index) => (
                <List.Item
                  actions={[
                    <Button
                      type="text"
                      icon={<CheckOutlined />}
                      onClick={() => completeTodo(index)}
                    />,
                  ]}
                >
                  {item}
                </List.Item>
              )}
            />
            <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
              <Input
                placeholder="添加待办事项"
                value={newTodo}
                onChange={e => setNewTodo(e.target.value)}
              />
              <Button type="primary" icon={<PlusOutlined />} onClick={addTodo}>
                添加
              </Button>
            </div>
          </Card>
        </Col>
        {/* 每日一句 */}
      </Row>
      <Row gutter={[16, 16]} style={{ width: '100%' }}>
        <Col span={12}>
          <Card>
            <Calendar fullscreen={false} />
          </Card>
        </Col>
        <Col span={12}>
          <Card bordered hoverable>
            <SmileOutlined
              style={{
                fontSize: '24px',
                marginBottom: '10px',
                color: '#52c41a',
              }}
            />
            <Title level={4}>每日一句</Title>
            <Text>"{quote}"</Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Welcome;
