import React, { useState } from 'react';
import { Form, Input, Button, Card, Select, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const LoginRegisterPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [exam_id, setExamId] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [role, setRole] = useState<string>('student');
  const [name, setName] = useState<string>();
  const [gender, setGender] = useState<string>('male');
  const [form] = Form.useForm();

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  const onFinish = async (values: any) => {
    console.log('Received values of form: ', values);

    const url = isLogin ? 'login' : 'register';

    const response = await fetch(`http://localhost:3010/auth/${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        exam_id: exam_id,
        password: password,
        role: role || null,
        name: name || null,
        gender: gender || null,
      }),
    });
    if (!response.ok) {
      message.error(`
        ${isLogin ? '登录' : '注册'}失败
      `);
      // throw new Error('Network response was not ok');
    }
    if (isLogin) {
      message.success('登录成功');
      const data = await response.json();
      console.log(data);
      localStorage.setItem('token', data.role);
      if (data.role === 'admin') {
        window.location.href = '/table';
      } else {
        window.location.href = '/query';
      }
    } else {
      form.resetFields();
      window.location.href = '/login';
      setIsLogin(true);
      message.success('注册成功');
    }
    // TODO: handle login/register
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Card style={{ width: 300 }}>
        <h2>四六级查分平台-{isLogin ? '登录' : '注册'}</h2>
        <Form
          form={form}
          name={isLogin ? 'login' : 'register'}
          onFinish={onFinish}
        >
          {!isLogin && (
            <>
              <Form.Item name="identity">
                <Select
                  defaultValue="student"
                  value={role}
                  onChange={(value: React.SetStateAction<string>) =>
                    setRole(value)
                  }
                  options={[
                    {
                      value: 'student',
                      label: '学生',
                    },
                    {
                      value: 'admin',
                      label: '管理员',
                    },
                  ]}
                ></Select>
              </Form.Item>
              <Form.Item name={'name'}>
                <Input
                  placeholder="姓名"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </Form.Item>
              <Form.Item name="gender">
                <Select
                  defaultValue="male"
                  value={gender}
                  onChange={(value: React.SetStateAction<string>) =>
                    setGender(value)
                  }
                  options={[
                    {
                      value: 'male',
                      label: '男',
                    },
                    {
                      value: 'female',
                      label: '女',
                    },
                  ]}
                ></Select>
              </Form.Item>
            </>
          )}
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入考生号!' }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="请输入考生号"
              value={exam_id}
              onChange={e => setExamId(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="密码"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              {isLogin ? '登录' : '注册'}
            </Button>
          </Form.Item>
        </Form>
        <Button type="link" onClick={toggleMode}>
          {isLogin ? '没有账号？去注册' : '已有账号？去登录'}
        </Button>
      </Card>
    </div>
  );
};

export default LoginRegisterPage;
