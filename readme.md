# tb-cli

![GitHub](https://img.shields.io/github/license/tb-fed/tb-cli)
![size](https://img.shields.io/github/repo-size/tb-fed/tb-cli)

dont forget to ignore the node modules. ;-)

## how-tos

### create a new project from template

```bash
honey new <template-name>
```

### strict git commit

```bash
honey commit
```

### lint code

```bash
honey lint
```

### run extend command

```bash
honey extend <command>
```

### build project

```bash
honey build
```

### start development server

```bash
honey dev
```

### format code

```bash
honey format
```

## config

honey config is put in project's package.json

for example:

```json
{
  "honeyConfig": {
    "src": "./src"
  }
}
```

### config options

#### src

source folder

e.g.

```json
{
  "honeyConfig": {
    "src": "./src"
  }
}
```

#### dist

source folder

e.g.

```json
{
  "honeyConfig": {
    "dist": "./dist"
  }
}
```

#### static

static resource folder, will not be compiled, just been copied to dist folder

e.g.

```json
{
  "honeyConfig": {
    "static": "./static"
  }
}
```

#### dev

development options

e.g.

```json
{
  "honeyConfig": {
    "dev": {
      "port" : 8080,
      "proxy": [
        {
          "from": "/access",
          "to": "https://wy-test.haina.com/access"
        }
      ],
      "mock": "path to mock.js"
    }
  }
}
```

#### how to write a mock file

e.g.

```javascript
module.exports = function(req, res) {
  console.log('req.path: ', req.path);
  if (req.path === '/access/timestamp') {
    res.send('' + Date.now());
    return false;
  }
};

```
