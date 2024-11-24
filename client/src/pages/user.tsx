import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Upload,
  message,
  Avatar,
  Card,
  Radio,
} from 'antd';
import { EditOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

interface User {
  _id: string;
  username: string;
  role: string;
  name: string;
  gender: string;
  birthDate?: string;
  age?: number;
  exam_id?: string;
  registerDate?: string;
  avatar?: string;
  phone?: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const date = new Date();

  // 获取用户信息
  useEffect(() => {
    fetch('http://localhost:3010/auth/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(() => message.error('无法获取用户信息'));
  }, []);

  // 计算用户年龄
  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const age = date.getFullYear() - birth.getFullYear();
    return age;
  };

  // 打开编辑模态框
  const onEdit = (user: User) => {
    setEditingUser(user);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...user,
      birthDate: user.birthDate ? dayjs(user.birthDate) : null,
    });
  };

  // 提交编辑
  const onSubmit = async () => {
    try {
      const updatedData = await form.validateFields();
      const response = await fetch(
        `http://localhost:3010/auth/users/${editingUser?._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...updatedData,
            birthDate: updatedData.birthDate?.toISOString(),
          }),
        }
      );
      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(prev =>
          prev.map(user => (user._id === updatedUser._id ? updatedUser : user))
        );
        message.success('用户信息更新成功');
        setIsModalVisible(false);
        setEditingUser(null);
      } else {
        throw new Error();
      }
    } catch {
      message.error('更新失败，请稍后再试');
    }
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      render: (text: any, record: any, index: number) => index + 1,
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar: string) => (
        <Avatar src={avatar} size={64} style={{ objectFit: 'cover' }} />
      ),
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '身份',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (role === 'admin' ? '管理员' : '学生'),
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender: string) => (gender === 'male' ? '男' : '女'),
    },
    {
      title: '出生日期',
      dataIndex: 'birthDate',
      key: 'birthDate',
      render: (date: string) =>
        date ? dayjs(date).format('YYYY-MM-DD') : '无',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '考生号',
      dataIndex: 'exam_id',
      key: 'exam_id',
    },
    {
      title: '注册时间',
      dataIndex: 'registerDate',
      key: 'registerDate',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: User) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => onEdit(record)}
        >
          编辑
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Card title="用户信息管理">
        <Table dataSource={users} columns={columns} rowKey="_id" />
        <Modal
          title="编辑用户信息"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onOk={onSubmit}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="姓名">
              <Input />
            </Form.Item>
            <Form.Item name="role" label="身份">
              <Radio.Group>
                <Radio value="admin">管理员</Radio>
                <Radio value="student">学生</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="gender" label="性别">
              <Radio.Group>
                <Radio value="male">男</Radio>
                <Radio value="female">女</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="birthDate" label="出生日期">
              <DatePicker />
            </Form.Item>
            <Form.Item name="exam_id" label="考生号">
              <Input />
            </Form.Item>
            <Form.Item name="phone" label="电话">
              <Input />
            </Form.Item>
            <Form.Item name="avatar" label="头像">
              <Upload>
                <Button icon={<UploadOutlined />}>上传头像</Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default UserManagement;
