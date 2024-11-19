import { Breadcrumb } from 'antd';
import { t } from 'i18next';
import ReactMarkdown from 'react-markdown';

export default function studyNotes() {
  return (
    <div>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>{t('Home')}</Breadcrumb.Item>
        <Breadcrumb.Item>{t('List')}</Breadcrumb.Item>
        <Breadcrumb.Item>{t('Notes')}</Breadcrumb.Item>
      </Breadcrumb>
      <ReactMarkdown>{markdownText}</ReactMarkdown>
    </div>
  );
}

const markdownText = `
# 运行说明

1. 错误提示

   由于开发过程中更新过 tags.tsx 等文件的大小写名称，运行时可能会提示模块导入错误的问题，只需*在 table.tsx 文件中修改导入语句即可*。例如，将'tags'改为'Tags'，或者修改部分文件名称开头字母为小写；
   另由于 linux 端和 windows 端文件内文本默认后缀不同，打开 json 等文件时可能大量报错，此时通过*修改 vscode 右下角的行尾格式为'LF'或'CRLF'即可解决*。

2. 运行流程

- 分别在终端中打开 client 和 server 文件夹，分别执行'npm install'命令安装依赖；
- 分别在 client 和 server 文件夹中执行'npm run start'命令启动项目；
- 打开浏览器，访问'http://localhost:3000'即可；
- 如使用 npm run build 打包，则只需要在 server 目录下执行 npm run start 即可，之后打开浏览器，访问'http://localhost:3001/index.html'即可。

# 开发要点

- React-router-dom
- restful api 设计
- react-i18next 库
- eslint 配置
- prettier
- webpack
- typescript
- localstorage

# 功能介绍

1. 使用 **dayjs** 模块处理日期数据；
2. 使用**restful api** 处理前后端数据交互；
3. 使用了 **localStorage** 存储信息，减少 api 请求次数；
4. 对输入框输入字数进行提示并限制，增强可阅读性和安全性；
5. 关于数据管理中的标签内容，支持**多标签添加修改**和多标签筛选；
6. 关于搜索功能，支持**连续筛选**功能，每次筛选将在上次筛选的结果上进行；
7. 添加了完善的**出错处理**，如果删除的标签已被使用或添加的标签已存在等情况下，系统会弹窗报错，可视性强；
8. 关于后端信息存储，存储位置为 server 目录下 3 个 json 文件，通过发送 api 请求，对这些文件进行读写，实现**增删改查**功能；
9. 关于多语言功能，引入了 **react-i18next** 库，支持中英文切换，点击设置切换语言后，向服务端发送请求，修改 lang.json 文件中 lang 信息，更新界面语言；

# 特色功能

1. 制作了**面包屑导航**；
2. 支持**多选标签**进行添加和筛选；
3. 添加了**加载动画**，使页面更加美观；
4. 编辑时默认*将现有内容添加到输入框*中，方便编辑；
5. 完善的**出错处理**，当出错时，会弹出相应的提示框；
6. 添加标签时，_按下回车键即可添加标签_，方便快捷；
7. 标签管理中，_支持单选或多选标签删除_，方便用户操作；
8. 给 modal 弹窗添加了 centered 属性，确保弹窗始终*居中显示*；
9. 添加或编辑数据时，如果未填必填信息，则提示用户重新填写；
10. 给原生颜色标签添加了对应的颜色，给非颜色标签添加*随机颜色*，当编辑页面内容时，标签颜色会随之改变，可玩性高；

# 问题记录

1. 拉取的 server 文件夹代码中，代码*后缀格式*为'LF', 与 windows 下默认后缀'CRLF'不
   一致，导致 eslint 大量报错；
2. 编写添加、修改标签等功能时，向后端发送的 api 请求一直报错，不清楚后端所需的详
   细请求 url 和参数格式，导致无法完成功能开发；
3. 在编写 table 行“编辑”功能时，由于弹出的 modal 和 table 是不同的组件，因此如何
   让 modal 组件获取到 table 行数据成为了一个问题；
4. 使用 put 方法修改数据时，发现虽然数据成功修改，但是网络中出现 404 报错；
5. 编写标签样式时，发现*难以给标签添加颜色*。如何给颜色类标签添加相应的颜色？又如
   何给非颜色类标签添加随机颜色？
6. 项目中需要展示的标签信息为标签的名称，而提供的 data.json 中 tags 内保存的为标
   签 id 信息，如果解决这种冲突呢？
7. 制作数据管理模块中的标签部分时，发现默认为单选，如何修改支持多标签添加和筛选呢？

# 解决方法

1. 终端下执行'git config --global core.autocrlf false'命令，_关闭自动转换_(重新拉
   取代码后生效)；或在 vscode 右下角手动切换格式为'LF';
2. 通过查阅资料和不断测试, 我逐渐明白不同请求方法之间的差异, get 方法无需任何额
   外参数, post 和 put 请求**需要在请求体中携带添加、修改的标签信息**, delete 请求需要在
   URL 中加入 id 信息。就这样，通过不断尝试，最终我成功完成添加和修改标签等功能
   ；
3. 仔细研究后，我发现可以利用 form 的 **filedsValue** 属性来实现这一方法。具体来说，
   我们可以在 table 行“编辑”按钮的 onClick 事件中，将 table 行数据作为参数传递给
   modal 组件，然后在 modal 组件中，通过 form 的 **setFieldsValue** 方法，将传递过来
   的 table 行数据设置为 form 的 filedsValue 属性，这样就可以实现 modal 组件获取
   table 行数据的功能；
4. 查询 KOA 官方文档后，我发现是 edit 方法中未返回 body 信息，koa 默认返回了 404
   错误，添加 body 信息后成功解决了该问题；
5. 仔细思考后，我想到：编写一个数组保存常见的颜色名称，编写一个方法用于判断标签
   内容是否在数组中，如果在，则使用对应颜色，否则使用随机颜色。最终，我成功实现
   了该功能；
6. 思考后，我觉得不再重构 json 代码，也不重新添加保存 tag 名称的字段。而是在渲染
   前过滤数据，将 tag id 转换为 tag name，保存或修改数据前执行相反的操作，从而解
   决了问题；
7. 研究后，通过在 select 组件上修改 mode 为 **multiple**，实现了多选组件，同时在状态管理中使用数组初始化标签信息，并同步修改添加、查询等部分信息，从而实现了该功能；

# 运行截图

1. 数据管理：

   ![数据管理](https://i2.mjj.rip/2024/06/05/fa4f716fea1e95a8983d52c2e6f78e14.png)

2. 标签管理：

   ![标签管理](https://i2.mjj.rip/2024/06/05/e4da50f304aca6ded5ed3fd848fa1d39.png)

3. 添加数据：

   ![添加数据](https://i2.mjj.rip/2024/06/05/3f16b68ee1dd9cc92fe002c7db758b63.png)

4. 编辑数据：

   ![编辑数据](https://i2.mjj.rip/2024/06/05/d651120145c4d8fb6113dab616ebfd7b.png)

5. 筛选和重置：

   ![筛选和重置](https://i2.mjj.rip/2024/06/05/d64525c4ea7d1ad89f4b132e7dd43d66.png)

6. 国际化切换：

   ![国际化切换](https://i2.mjj.rip/2024/06/05/6b527d3067a3787a392adb116e8b9ffa.png)
`;
