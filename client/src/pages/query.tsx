import React, { useEffect, useState } from 'react';
import { Card, Avatar, Grid, message, Input, Button } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Meta } = Card;
const { useBreakpoint } = Grid;

interface Grade {
  exam_id: string;
  avatar?: string;
  examDate: string;
  level: string;
  score: number;
  passed: boolean;
}

const Query: React.FC = () => {
  const [grade, setGrade] = useState<Grade>();
  const [loading, setLoading] = useState(true);
  const screens = useBreakpoint();
  const [exam_id, setExamId] = useState('');

  const queryGrade = async () => {
    // 获取成绩信息

    try {
      if (!exam_id) {
        message.error('请输入考生号');
        return;
      }

      setLoading(true);
      const grade = await fetch('http://localhost:3010/auth/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exam_id: exam_id,
        }),
      });
      if (!grade.ok) {
        message.error('无法获取成绩信息，请稍后再试');
        setLoading(false);
        return;
      }
      const data = await grade.json();
      const formattedData = {
        exam_id: data.exam_id,
        avatar: data.avatar || 'https://www.loliapi.com/acg/pp/',
        examDate: data.examDate,
        level: data.level,
        score: data.score,
        passed: data.score >= 425,
      };
      setGrade(formattedData);
      setLoading(false);
    } catch (error) {
      message.error((error as Error).message);
      setLoading(false);
    }
  };

  const renderStatusIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircleOutlined style={{ color: 'green', fontSize: 24 }} />
    ) : (
      <CloseCircleOutlined style={{ color: 'red', fontSize: 24 }} />
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '100px auto',
      }}
    >
      <LoginOutlined
        onClick={() => {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }}
        className="icon"
        style={{
          position: 'absolute',
          top: '50px',
          right: '50px',
        }}
      />
      <h1>四六级查分平台</h1>

      <Input
        addonBefore="考生号"
        placeholder="请输入考生号"
        value={exam_id}
        onChange={e => setExamId(e.target.value)}
        size="large"
        prefix={<UserOutlined />}
        autoFocus
        maxLength={20}
        style={{
          width: '300px',
          marginBottom: '20px',
        }}
      />
      <Button
        onClick={queryGrade}
        disabled={!exam_id}
        type="primary"
        size="large"
      >
        查询成绩
      </Button>
      {grade && (
        <div
          style={{
            padding: '20px',
          }}
        >
          <Card
            key={grade?.exam_id}
            loading={loading}
            hoverable
            style={{
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          >
            <Meta
              avatar={
                <Avatar src={grade?.avatar} size={64} icon={<UserOutlined />} />
              }
              title={`考生号: ${grade?.exam_id}`}
              description={`考试级别: ${grade?.level}`}
            />
            <div style={{ marginTop: 20 }}>
              <p>考试时间: {dayjs(grade?.examDate).format('YYYY-MM-DD')}</p>
              <p>考试成绩: {grade?.score} 分</p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                是否通过: {renderStatusIcon(grade?.passed)}{' '}
                {grade?.passed ? '通过' : '未通过'}
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Query;
