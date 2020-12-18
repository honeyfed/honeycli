# honey-cli

![GitHub](https://img.shields.io/github/license/honeyfed/honeycli)
![size](https://img.shields.io/github/repo-size/honeyfed/honeycli)

## how-tos

### 升级cli

```bash
honey upgrade
```

### 新建项目

```bash
honey new
```

### 提交代码

```bash
honey commit
```

### 校验代码

```bash
honey lint
```

### run extend command

```bash
honey extend <command>
```

### 构建项目

```bash
honey build
```

### 本地调试

```bash
honey dev
```

### 格式化代码

```bash
honey format
```

## config

**honeycli**的配置写在项目的*package.json*里

如下：

```json
{
  "honeyConfig": {
    "src": "./src"
  }
}
```

### 配置参数

#### src

源码目录

e.g.

```json
{
  "honeyConfig": {
    "src": "./src"
  }
}
```

#### dist

代码生成目录

e.g.

```json
{
  "honeyConfig": {
    "dist": "./dist"
  }
}
```

#### static

静态资源目录，目录中文件不会被编译，只会被复制到代码生成目录中

e.g.

```json
{
  "honeyConfig": {
    "static": "./static"
  }
}
```

#### isLib

是否为组件/库项目

e.g.

```json
{
  "honeyConfig": {
    "isLib": true
  }
}
```

#### libName

组件名（必须是蛇形命名, 如：**dropdown-menu**）

e.g.

```json
{
  "honeyConfig": {
    "libName": "dropdown-menu"
  }
}
```

#### cdn

配置cdn地址

e.g.

```json
{
  "honeyConfig": {
    "cdn": "https://static.xx.com"
  }
}
```

#### rem

是否自动转换px为rem, 默认为*false*

e.g.

```json
{
  "honeyConfig": {
    "rem": true
  }
}
```

#### dev

开发配置

如下：

- *port* 开发服务器监听端口
- *proxy* 接口映射
- *mock* mock文件

```json
{
  "honeyConfig": {
    "dev": {
      "port" : 8080,
      "proxy": [
        {
          "from": "/access",
          "to": "https://wy-test.haina.com"
        }
      ],
      "mock": "path to mock.js"
    }
  }
}
```

#### 如何编写mock文件

如下：

```javascript
module.exports = function(req, res) {
  console.log('req.path: ', req.path);
  if (req.path === '/access/timestamp') {
    res.send('' + Date.now());
    return false;
  }
};

```
