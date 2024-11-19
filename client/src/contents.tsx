import React, { useEffect, useState } from 'react';
import { AJAX, colorValues } from './helpers';
import dayjs, { Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';
import {
  Breadcrumb,
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Table,
  Tag,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const Contents: React.FC = () => {
  const { t } = useTranslation();

  const [current, setCurrent] = useState(1); // 当前序号
  const [dataSourceState, setDataSourceState] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [id, setId] = useState(0); // 假设id是数字类型。
  const [name, setName] = useState(''); // 标题输入框的值
  const [description, setDescription] = useState(''); // 描述输入框的值
  const [tag, setTag] = useState(''); // 标签输入框的值，假设标签是字符串数组。
  const [isEdit, setIsEdit] = useState(false); // 是否是编辑模式，默认为false，即新增模式。
  const [nameFilter, setNameFilter] = useState(''); // 标题筛选器的值，默认为空字符串。
  const [tagFilter, setTagFilter] = useState([]); // 标签筛选器的值，默认为空字符串。
  const [dateRangeFilter, setDateRangeFilter] = useState([null, null]); // 日期筛选器的值，默认为空数组。
  const [loading, setLoading] = useState(false); // 表格加载状态，默认为false。

  const [form] = Form.useForm();
  const [formFilter] = Form.useForm();

  interface OptionType {
    value: string | number;
    label: string;
  }

  const [options, setOptions] = useState<OptionType[]>([]); // 初始化选项为空数组。

  useEffect(() => {
    try {
      const getTags = async () => {
        showLoading();
        const response = await fetch('/api/tags');
        const data = await response.json();
        setOptions(
          data.data.map((item: { name: any }) => ({
            value: item.name,
            label: item.name,
          }))
        );
      };
      getTags();
      getData();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  const clearState = () => {
    setName(''); // 清空name状态。
    setDescription(''); // 清空description状态。
    setTag(''); // 清空tag状态。
  };

  const clearStateFilter = () => {
    setNameFilter(''); // 清空name状态。
    setTagFilter([]); // 清空tag状态。
    setDateRangeFilter([]); // 清空time状态。
  };

  const handleDelete = async (record: { id: any }) => {
    await fetch(`/api/data?id=${record.id}`, {
      method: 'delete',
    });
    getData();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value); // 更新标题输入框的值
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value); // 更新描述输入框的值
  };

  const handleTagChange = (value: React.SetStateAction<string>) => {
    setTag(value); // 更新标签输入框的值，假设标签是字符串数组。
  };

  const columns = [
    {
      title: t('Order'),
      hideInSearch: true,
      i18n: (t: (arg0: string) => any) => t('Header Title'),
      render: (text: any, record: any, index: any) =>
        `${index + 1 + 10 * (current - 1)}`,
    },
    {
      title: t('Name'),
      dataIndex: 'name',
      copyable: true,
      ellipsis: true,
      tooltip: '名称过长会自动收缩',
      fieldProps: {
        maxLength: 20, // 设置最大长度。
        placeholder: '请输入名称', // 设置输入框的提示文本。
        labelWidth: 50, // 设置label的宽度。
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: t('Description'),
      dataIndex: 'description',
      copyable: true,
      tooltip: '描述过长会自动收缩',
      hideInSearch: true, // 搜索时不显示该列。
    },
    {
      title: t('Add Time'),
      dataIndex: `time`,
      valueType: 'dateRange', // 设置为日期时间格式。
    },
    {
      title: t('Tags'),
      dataIndex: 'tags',
      fieldProps: { mode: 'tags' }, // 设置为标签模式，允许输入多个标签。
      valueType: 'select',
      render: (text: any, record: any, index: any) => {
        // 假设数组中的每个元素都是字符串
        const getTagColor = (tag: string) => {
          return colorValues.includes(tag)
            ? tag
            : colorValues[Math.floor(Math.random() * colorValues.length)];
        };
        if (Array.isArray(text)) {
          return text.map(
            (tag: string, index: React.Key | null | undefined) => (
              <Tag key={index} color={getTagColor(tag)}>
                {tag}
              </Tag>
            )
          );
        } else {
          return (
            <Tag key={1} color={getTagColor(text)}>
              {text}
            </Tag>
          );
        }
      },
    },
    {
      title: 'id',
      dataIndex: `id`,
      hidden: true, // 隐藏该列。
    },
    {
      title: t('Action'),
      valueType: 'option',
      key: 'option',
      render: (text: any, record: any, index: any) => [
        <Flex gap={10}>
          <a
            key="editable"
            onClick={() => {
              setIsEdit(true);
              setId(text.id); // 设置id输入框的值。
              setName(text.name); // 设置标题输入框的值
              setDescription(text.description); // 设置描述输入框的值
              setTag(text.tags); // 设置标签输入框的值，假设标签是字符串数组。
              showModal(text); // 显示弹窗，并设置表单的值。
            }}
          >
            {t('Edit')}
          </a>
          <Popconfirm
            title="确认删除?"
            onConfirm={() => {
              handleDelete(text);
            }}
          >
            <a
              target="_blank"
              rel="noopener noreferrer"
              key="delete"
              style={{ color: 'red' }}
            >
              {t('Delete')}
            </a>
          </Popconfirm>
        </Flex>,
      ],
    },
  ];

  const showModal = (text: any) => {
    setOpen(true);
    if (text) form.setFieldsValue(text);
  };

  const handleOk = async () => {
    try {
      form.validateFields();
      if (!name || !description || !tag) return;
      showLoading();
      if (isEdit) {
        await fetch(`/api/data`, {
          method: 'put', // 注意：这里使用的是put方法，而不是post。因为我们要更新数据。
          headers: { 'Content-Type': 'application/json' }, // 设置请求头，告诉服务器请求体的格式是 JSON 格式的数据。
          body: JSON.stringify({ id, name, description, tags: tag }), // 将要发送的数据转换为 JSON 格式的字符串。
          // 注意：这里我们发送的是一个对象，而不是数组。因为服务器端需要的是一个对象，而不是数组。
        }).then(res => res.json()); // 注意：这里我们使用的是res.json()方法，而不是res.text()方法。因为我们要获取的是JSON格式的数据。
      } else {
        await fetch(`/api/data`, {
          method: 'post',
          headers: { 'Content-Type': 'application/json' }, // 设置请求头，告诉服务器请求体的格式是 JSON 格式的数据。
          body: JSON.stringify({ name, description, tags: tag }), // 将要发送的数据转换为 JSON 格式的字符串。
        });
      }
      getData();
      setConfirmLoading(true);
      setTimeout(() => {
        setOpen(false);
        setConfirmLoading(false);
      }, 500);
      form.resetFields(); // 重置表单。
    } catch (error) {
      console.error('Error creating data:', error);
    }
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
    clearState();
    setIsEdit(false); // 重置编辑状态。
  };

  const getData = async () => {
    try {
      showLoading();
      const response = await fetch('/api/data');
      const data = await response.json();
      let tagsArray = await AJAX('/api/tags'); // 假设标签是字符串数组。
      tagsArray = tagsArray.data;
      setDataSourceState(
        data.data.dataInfo.map(
          (item: {
            time: string | number | Date | Dayjs | null | undefined;
            tags: any;
            name: any;
          }) => ({
            ...item,
            tags: item.tags.map(
              (tag: string) =>
                tagsArray.find((t: { id: string }) => t.id === tag)?.name
            ),
            time: dayjs(item.time).format('YYYY-MM-DD HH:mm:ss'), // 格式化每个item的time
          })
        )
      );
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  function filterData() {
    let newData = dataSourceState;
    if (nameFilter) {
      newData = newData.filter((item: { name: string }) =>
        item.name.includes(nameFilter)
      );
    }
    if (tagFilter) {
      newData = newData.filter((item: { tags: string[] }) =>
        tagFilter.every(tag => item.tags.includes(tag))
      );
    }
    if (
      dateRangeFilter &&
      dateRangeFilter.length === 2 &&
      dateRangeFilter[0] &&
      dateRangeFilter[1]
    ) {
      const start = dayjs(dateRangeFilter[0]).format('YYYY-MM-DD HH:mm:ss'); // 格式化日期范围选择器的开始日期。
      const end = dayjs(dateRangeFilter[1]).format('YYYY-MM-DD HH:mm:ss'); // 格式化日期范围选择器的结束日期。
      newData = newData.filter(
        (item: { time: string }) => item.time >= start && item.time <= end
      ); // 过滤日期范围。
    }
    setDataSourceState(newData); // 假设返回的数据格式与表格数据源一致。具体格式需要根据后端返回的数据格式来确定。
    showLoading();
  }

  const showLoading = () => {
    setLoading(true); // 设置loading状态为true，显示加载中的效果。
    setTimeout(() => {
      setLoading(false); // 设置loading状态为true，显示加载中的效果。
    }, 500);
  };

  const handleTagFilterChange = (value: any) => {
    setTagFilter(value); // 假设tag选择器返回的是字符串。具体格式需要根据tag选择器的返回值来确定。
  };

  const handleDateRangeFilterChange = (value: any) => {
    setDateRangeFilter(value); // 假设日期范围选择器返回的是字符串数组。具体格式需要根据日期范围选择器的返回值来确定。
  };

  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>{t('Home')}</Breadcrumb.Item>
        <Breadcrumb.Item>{t('List')}</Breadcrumb.Item>
        <Breadcrumb.Item>{t('Content')}</Breadcrumb.Item>
      </Breadcrumb>
      <Flex justify="space-between">
        <Form form={formFilter}>
          <Flex gap={20}>
            <Form.Item label={t('Name')} name="name">
              <Input
                maxLength={20}
                showCount
                value={nameFilter}
                onChange={e => setNameFilter(e.target.value)}
                placeholder={t('Please input the name')}
                onPressEnter={() => {
                  filterData();
                  formFilter.resetFields();
                }}
              />
            </Form.Item>
            <Form.Item
              label={t('Tags')} // 假设description字段名是description。具体字段名需要根据后端返回的数据来确定。
              name="tags"
              style={{ width: 200 }}
            >
              <Select
                placeholder={t('Please select the tag')}
                onChange={handleTagFilterChange}
                mode="multiple"
                options={options}
                value={tagFilter}
              ></Select>
            </Form.Item>
            <Form.Item label={t('Add Time')} name="time">
              <DatePicker.RangePicker
                style={{ marginBottom: 20 }}
                onChange={handleDateRangeFilterChange}
              />
            </Form.Item>
          </Flex>
        </Form>
        <Flex gap={10}>
          <Button
            onClick={() => {
              getData();
              formFilter.resetFields();
              clearStateFilter();
            }}
            style={{ marginBottom: 20 }}
          >
            {t('Reset')}
          </Button>
          <Button
            type="primary"
            onClick={() => {
              filterData();
              formFilter.resetFields();
            }}
            style={{ marginBottom: 20 }}
          >
            {t('Query')}
          </Button>
        </Flex>
      </Flex>
      <Flex justify="flex-end">
        <Button type="primary" onClick={showModal} style={{ marginBottom: 20 }}>
          <PlusOutlined />
          {t('Add Content')}
        </Button>
      </Flex>
      <Table
        columns={columns}
        dataSource={dataSourceState}
        pagination={{ showQuickJumper: true }}
        onChange={pagination =>
          setCurrent(pagination.current ? pagination.current : 1)
        }
        loading={loading}
      ></Table>

      <Modal
        title={isEdit ? t('Edit Content') : t('Add Content')}
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        centered
      >
        <Form
          preserve={false}
          form={form}
          initialValues={form.getFieldsValue()}
        >
          <Form.Item label={t('Name')} name="name" rules={[{ required: true }]}>
            <Input
              maxLength={20}
              showCount
              value={name}
              onChange={handleNameChange}
              onPressEnter={handleOk}
              placeholder={t('Please input the name')}
            />
          </Form.Item>
          <Form.Item
            label={t('Description')}
            name="description"
            rules={[{ required: true }]}
          >
            <Input
              maxLength={50}
              showCount
              value={description}
              onChange={handleDescriptionChange}
              onPressEnter={handleOk}
              placeholder={t('Please input the description')}
            />
          </Form.Item>
          <Form.Item label={t('Tags')} name="tags" rules={[{ required: true }]}>
            <Select
              onChange={handleTagChange}
              mode="multiple"
              options={options}
            ></Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Contents;
