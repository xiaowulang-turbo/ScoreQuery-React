import React, { useEffect, useState } from 'react';
import {
  Table,
  Tag,
  Button,
  message,
  Card,
  Space,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Switch,
  Popover,
  Popconfirm,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

interface Grade {
  _id: string;
  name: string;
  exam_id: string;
  level: string;
  examDate: string;
  score: number;
  isPassed: boolean;
}

const Grades = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  const [isModalVisible2, setIsModalVisible2] = useState(false);

  useEffect(() => {
    // 拉取学生成绩信息
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await fetch('http://localhost:3010/auth/grade');
      if (!response.ok) {
        throw new Error('无法获取成绩信息，请稍后再试');
      }
      const data = await response.json();
      console.log(data);
      setGrades(
        data.map((grade: any) => ({
          ...grade,
          isPassed: grade.score > 425,
        }))
      );
      setLoading(false);
    } catch (error) {
      message.error('无法获取成绩信息，请稍后再试');
      setLoading(false);
    }
  };

  const handleEdit = (record: Grade) => {
    setEditingGrade(record);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...record,
      examDate: record.examDate ? dayjs(record.examDate) : null,
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const response = await fetch(
        `http://localhost:3010/auth/grade/${editingGrade?._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error('无法更新成绩信息，请稍后再试');
      }

      const updatedGrade = await response.json();
      setGrades(prev =>
        prev.map(grade =>
          grade._id === updatedGrade._id
            ? {
                ...updatedGrade,
                isPassed: updatedGrade.score > 425,
              }
            : grade
        )
      );

      message.success('成绩信息更新成功');
      setIsModalVisible(false);
      setEditingGrade(null);
      form.resetFields();
    } catch (error) {
      message.error('无法更新成绩信息，请稍后再试');
    }
  };

  const showModal = () => {
    setIsModalVisible2(true);
  };

  const handleCancel2 = () => {
    setIsModalVisible2(false);
  };

  const handleOk2 = async () => {
    try {
      const values = await form2.validateFields();

      const response = await fetch('http://localhost:3010/auth/grade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw new Error('无法添加成绩信息，请稍后再试');
      }

      const newGrade = await response.json();
      setGrades(prev => [...prev, newGrade]);

      message.success('成绩信息添加成功');
      setIsModalVisible2(false);
      form.resetFields();

      // 重新拉取成绩信息
      fetchGrades();
    } catch (error) {
      message.error('无法添加成绩信息，请稍后再试');
    }
  };

  const handleDelete = async (_id: string) => {
    try {
      const response = await fetch(`http://localhost:3010/auth/grade/${_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('无法删除成绩信息，请稍后再试');
      }
      setGrades(prev => prev.filter(grade => grade._id !== _id));

      message.success('成绩信息删除成功');
    } catch (error) {
      message.error('无法删除成绩信息，请稍后再试');
    }
  };

  const columns: ColumnsType<Grade> = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      render: (_, record, index) => index + 1,
    },
    {
      title: '学生姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '考生号',
      dataIndex: 'exam_id',
      key: 'exam_id',
    },
    {
      title: '考试时间',
      dataIndex: 'examDate',
      key: 'examDate',
      render: examDate => examDate && dayjs(examDate).format('YYYY-MM-DD'),
    },
    {
      title: '考试级别',
      dataIndex: 'level',
      key: 'level',
      render: level => (level === 'CET4' ? '四级' : '六级'),
    },
    {
      title: '考试成绩',
      dataIndex: 'score',
      key: 'score',
    },
    {
      title: '是否合格',
      dataIndex: 'isPassed',
      key: 'isPassed',
      render: isPassed => (
        <Tag color={isPassed ? 'green' : 'red'}>
          {isPassed ? '合格' : '不合格'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          <Button
            type="primary"
            // disabled={role !== 'admin'}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          {'   '}
          <Popconfirm
            title="确定要删除该成绩吗？"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button
              color="danger"
              variant="solid"
              // type="primary"
              // onClick={() => handleDelete(record._id)}
            >
              删除
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card
        title="学生成绩管理"
        bordered={false}
        style={{
          width: '100%',
        }}
      >
        <Table
          dataSource={grades}
          columns={columns}
          rowKey="_id"
          loading={loading}
        />
        <Modal
          title="编辑成绩"
          open={isModalVisible}
          onCancel={handleCancel}
          onOk={handleOk}
        >
          <Form form={form} layout="vertical">
            <Form.Item label="考试时间" name="examDate">
              <DatePicker />
            </Form.Item>
            <Form.Item label="考试级别" name="level">
              <Select>
                <Select.Option value="CET4">四级</Select.Option>
                <Select.Option value="CET6">六级</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="考试成绩" name="score">
              <InputNumber />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="添加成绩"
          open={isModalVisible2}
          onCancel={handleCancel2}
          onOk={handleOk2}
        >
          <Form
            form={form2}
            layout="vertical"
            initialValues={{
              examDate: dayjs(new Date()),
              level: 'CET4',
            }}
          >
            <Form.Item
              label="学生姓名"
              name="name"
              rules={[{ required: true, message: '请输入学生姓名' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="考生号"
              name="exam_id"
              rules={[{ required: true, message: '请输入考生号' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="考试时间" name="examDate">
              <DatePicker />
            </Form.Item>
            <Form.Item label="考试级别" name="level">
              <Select>
                <Select.Option value="CET4">四级</Select.Option>
                <Select.Option value="CET6">六级</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="考试成绩"
              name="score"
              rules={[
                {
                  required: true,
                  message: '请输入正确的考试成绩',
                  type: 'number',
                  min: 0,
                  max: 710,
                },
              ]}
            >
              <InputNumber />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
      <Button type="primary" onClick={showModal} style={{ marginTop: 16 }}>
        添加成绩
      </Button>
    </div>
  );
};

export default Grades;
