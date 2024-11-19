import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { colorValues } from './helpers';
import {
  Breadcrumb,
  Button,
  Divider,
  Flex,
  Form,
  Input,
  Modal,
  Popconfirm,
  Radio,
  Table,
  Tag,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

export default function Tags() {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [name, setName] = useState(''); // 定义一个状态变量来存储输入的值。
  const [id, setId] = useState(''); // 定义一个状态变量来存储输入的值。
  const [tags, setTags] = useState([]); // 定义一个状态变量来存储标签列表。
  const [tag, setTag] = useState(''); // 定义一个状态变量来存储输入的标签。
  const [isEdit, setIsEdit] = useState(false); // 定义一个状态变量来判断是否是编辑模式。
  const [loading, setLoading] = useState(false); // 表格加载状态，默认为false。

  const [form] = Form.useForm<{ name: string }>();
  const [formFilter] = Form.useForm();

  const pagination = {
    pageSize: 10, // 默认每页行数，默认是 10 行每页，可以自己设置
    showQuickJumper: true,
  };

  useEffect(() => {
    showLoading();
    getTags(); // 获取标签列表。
  }, []);

  const handleDelete = async (text: { id: string }) => {
    try {
      let res = await fetch(`/api/tags?id=${text.id}`, {
        method: 'delete',
      });
      if (!res.ok) {
        window.alert(t('Fail to delete the tag, it has already been used.')); // 这里需要根据实际情况处理错误信息。
      }
      getTags();
    } catch (error) {
      window.alert(error);
    }
  };

  const columns = [
    {
      title: t('Tags'),
      dataIndex: 'name',
      key: 'name',
      render: (text: any) => {
        const getTagColor = (tag: string) => {
          return colorValues.includes(tag)
            ? tag
            : colorValues[Math.floor(Math.random() * colorValues.length)];
        };
        return (
          <Tag key={text} color={getTagColor(text)}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      hidden: true, // 隐藏在表格中显示，但是可以搜索。
    },
    {
      title: t('Action'),
      align: 'left' as 'left',
      key: 'option',
      colSpan: 2,
      width: 80,
      render: (text: any, record: any, index: any) => (
        <a
          onClick={() => {
            showModal(text);
            setId(text.id);
            setName(text.name);
            setIsEdit(true);
          }}
        >
          {t('Edit')}
        </a>
      ),
    },
    {
      title: t('Action'),
      key: 'option',
      colSpan: 0,
      render: (text: any, record: any, index: any) => (
        <Popconfirm
          title={t('Confirm to delete?')}
          onConfirm={() => {
            handleDelete(text);
          }}
        >
          <a key="delete" style={{ color: 'red' }}>
            {t('Delete')}
          </a>
        </Popconfirm>
      ),
    },
  ];

  interface DataType {
    tag: string;
    key: React.Key;
    name: string;
    age: number;
    address: string;
  }

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectTags(selectedRows); // 更新选中的标签列表。
      if (!selectedRows) {
      }
    },
    getCheckboxProps: (record: DataType) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };

  const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>(
    'checkbox'
  );
  const [selectTags, setSelectTags] = useState<any[]>([]); // 选中的标签列表。

  const showLoading = () => {
    setLoading(true); // 设置loading状态为true，显示加载中的效果。
    setTimeout(() => {
      setLoading(false); // 设置loading状态为true，显示加载中的效果。
    }, 500);
  };

  const getTags = () => {
    fetch('/api/tags') // 获取标签列表。
      .then(res => res.json()) // 将响应体转换为 JSON 格式。
      .then(data => setTags(data.data)); // 更新状态变量，以反映获取的标签列表。
  };

  const filterTags = () => {
    showLoading();
    const data = tags.filter((item: { name: string | any[] }) =>
      item.name.includes(tag)
    ); // 过滤标签列表，只保留包含输入值的标签。
    setTags(data); // 更新状态变量，以反映过滤后的标签列表。
  };

  const deleteTags = async () => {
    showLoading();
    await Promise.all(
      selectTags.map(async item => {
        const response = await fetch(`/api/tags/?id=${item.id}`, {
          method: 'delete',
        });

        // 如果响应状态码不是ok，则抛出错误
        if (!response.ok) {
          throw new Error(
            t('Fail to delete the tag. It may have already been used.')
          );
        }
      })
    );
    getTags(); // 更新标签列表。
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value); // 更新状态变量，以反映输入的值。
  };

  const showModal = (text: any | null) => {
    setOpen(true);
    if (text) form.setFieldsValue(text);
    else form.resetFields(); // 重置表单。
  };

  const handleOk = async () => {
    showLoading();

    if (isEdit) {
      await fetch(`/api/tags`, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' }, // 设置请求头，告诉服务器请求体的格式是 JSON 格式的数据。
        body: JSON.stringify({ id: id, name: name }), // 将要发送的数据转换为 JSON 格式的字符串。
      });
    } else {
      const res = await fetch(`/api/tags`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' }, // 设置请求头，告诉服务器请求体的格式是 JSON 格式的数据。
        body: JSON.stringify({ name: name }), // 将要发送的数据转换为 JSON 格式的字符串。
      });
      if (!res.ok)
        window.alert(t('Fail to add the tag, it has already existed.')); // 如果响应的状态码不是 200，弹出提示。
    }
    getTags();
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 500);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

  function handleTagInput(e: React.ChangeEvent<HTMLInputElement>): void {
    setTag(e.target.value); // 更新状态变量，以反映输入的值。
  }

  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>{t('Home')}</Breadcrumb.Item>
        <Breadcrumb.Item>{t('List')}</Breadcrumb.Item>
        <Breadcrumb.Item>{t('Tags')}</Breadcrumb.Item>
      </Breadcrumb>
      <Flex justify="space-between">
        <Form form={formFilter}>
          <Form.Item label={t('Tags')} name="name" rules={[{ required: true }]}>
            <Input
              maxLength={20}
              showCount
              onChange={handleTagInput}
              placeholder={t('Please input the tag name')}
              onPressEnter={() => {
                filterTags();
                formFilter.resetFields();
              }}
            ></Input>
          </Form.Item>
        </Form>
        <Flex gap={10}>
          <Button
            onClick={() => {
              getTags();
              showLoading();
              formFilter.resetFields(); // 重置表单。
            }}
            style={{ marginBottom: 20 }}
          >
            {t('Reset')}
          </Button>
          <Button
            type="primary"
            onClick={() => {
              filterTags();
              formFilter.resetFields();
            }}
            style={{ marginBottom: 20 }}
          >
            {t('Query')}
          </Button>
        </Flex>
      </Flex>
      <Flex justify="flex-end" gap={20}>
        <Button
          type="primary"
          onClick={() => {
            showModal('');
            setIsEdit(false);
          }}
          style={{ marginBottom: 20 }}
        >
          <PlusOutlined />
          {t('Add Tag')}
        </Button>

        <Button
          type="primary"
          style={{ backgroundColor: 'red' }}
          disabled={!selectTags.length}
          onClick={() => {
            deleteTags();
          }}
        >
          <DeleteOutlined />
          {t('Delete All')}
        </Button>
      </Flex>
      <Radio.Group
        onChange={({ target: { value } }) => {
          setSelectionType(value);
        }}
        value={selectionType}
      >
        <Radio value="checkbox">{t('Checkbox')}</Radio>
        <Radio value="radio">{t('Radio')}</Radio>
      </Radio.Group>

      <Divider />
      <Table
        rowKey="id" // 主键 id 唯一的 key
        columns={columns} // 定义的列
        pagination={pagination}
        dataSource={tags}
        loading={loading}
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
      ></Table>
      <Modal
        title={isEdit ? t('Edit Tag') : t('Add Tag')}
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        centered
      >
        <Form form={form}>
          <Form.Item label={t('Tags')} name="name" rules={[{ required: true }]}>
            <Input
              maxLength={20}
              showCount
              value={name}
              onChange={handleNameChange}
              onPressEnter={handleOk}
              placeholder={t('Please input the tag name')}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
