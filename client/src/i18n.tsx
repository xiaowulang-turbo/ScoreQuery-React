import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  zh: {
    translation: {
      'Header Title': '内容管理平台',
      Language: '中文',
      Home: '首页',
      List: '列表',
      Content: '内容',
      Notes: '笔记',
      'Menu Item Content': '数据管理',
      'Menu Item Tags': '标签管理',
      'Menu Item Notes': '学习笔记',
      Order: '序号',
      Name: '名称',
      Description: '描述',
      'Add Time': '添加时间',
      Tags: '标签',
      Action: '操作',
      Edit: '编辑',
      Delete: '删除',
      Reset: '重置',
      Query: '查询',
      Checkbox: '多选',
      Radio: '单选',
      'Add Content': '添加内容',
      'Edit Content': '编辑内容',
      'Add Tag': '添加标签',
      'Edit Tag': '编辑标签',
      'Delete All': '删除全部',
      'Please input the name': '请输入名称',
      'Please input the tag name': '请输入标签名称',
      'Please select the tag': '请选择标签',
      'Please input the description': '请输入描述',
      'Confirm to delete?': '确认删除?',
      'Fail to delete the tag, it has already been used.':
        '删除失败，该标签已被使用。',
      'Fail to add the tag, it has already existed.':
        '添加失败，该标签已存在。',
    },
  },
  en: {
    translation: {
      'Header Title': 'Content Management Platform',
      Language: 'EN',
      Setting: 'Setting',
      Home: 'Home',
      List: 'List',
      Content: 'Content',
      'Menu Item Content': 'Data Management',
      'Menu Item Tags': 'Tags Management',
      'Menu Item Notes': 'Study Notes',
      Order: 'Order',
      Name: 'Name',
      Description: 'Description',
      'Add Time': 'Add Time',
      Tags: 'Tags',
      Action: 'Action',
      Edit: 'Edit',
      Delete: 'Delete',
      Reset: 'Reset',
      Query: 'Query',
      'Add Content': 'Add Content',
      'Edit Content': 'Edit Content',
      'Add Tag': 'Add Tag',
      'Edit Tag': 'Edit Tag',
      'Please input the name': 'Please input the name',
      'Please input the tag name': 'Please input the tag name',
      'Please select the tag': 'Please select the tag',
      'Confirm to delete?': 'Confirm to delete?',
      'Fail to delete the tag, it has already been used.':
        'Fail to delete the tag, it has already been used.',
      'Fail to add the tag, it has already existed.':
        'Fail to add the tag, it has already existed.',
    },
  },
  fr: {
    translation: {
      'Welcome to React': 'Bienvenue à React et react-i18next',
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'zh', // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
