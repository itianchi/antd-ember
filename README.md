# Ember-cli-idcos

iDCOS 前端 ember 组件库

## 使用方式

第一步：clone 项目到本地并执行 npm link

```shell
  $ git clone git@gitlab.idcos.net:CXJ/ember-cli-idcos.git
  $ npm install
  $ bower install
  $ npm link ember-cli-idcos
```


第二步：在你的项中依赖 ember-cli-idcos

```shell
  your-project$ npm link ember-cli-idcos 
  your-project$ vim package.json // 添加 dependencies ，"ember-cli-idcos": "*"
```


## 开发

* 参考上面的使用
* 直接修改 ember-cli-idcos 中的代码，修改并提交


## BACKLOGS
[] ember-moment 
[] autentication
[] 级联选择器
[] 基础控件样式
  - checkbox
  - radio
  - switcher 
[] transfer http://ant.design/components/transfer/ 
[] treeSelect http://ant.design/components/tree-select/ 
[] 文件上传 http://ant.design/components/upload/ 
[] 日历 
[] 图标库
[] popover http://ant.design/components/popconfirm/
[] progress 


## SPRINT (one week)

- 快速入门教程
- layout 布局教程 
  - bootstrap grid
  - block flexbox 

- Tabs
- Dropdown 
- Tooltip 
- Alert 提示

- Message 消息 
- DatePicker 日期选择器
- icon 文档 

- Slider 华东输入 
- Upload 文件上传 

## SPRINT DONE 

## PRODUCT
- 文档网站 
  - 网站设计
    - 首页
    - 文档页面
  - 网站实现 
    - 文档样式
    - 语法高亮
    - demo 展示
- modal
- form 组件系列
  - form-validator
- tree  [ember-idx-tree](http://indexiatech.github.io/ember-idx-tree/simple)
- table 组件 
    - 参考
        - http://addepar.github.io/ember-table/#/simple
        - http://onechiporenko.github.io/ember-models-table/
    - 功能
- select 组件
    -  参考
        -  https://www.npmjs.com/package/ember-select-guru
        -  https://tedconf.github.io/ember-searchable-select/
    -  功能
        -  下拉选择
        -  下拉搜索
        -  多选
        -  远程搜索
