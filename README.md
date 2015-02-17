# <img src="http://cdn.tjw.io/images/sails-logo.png" height='43px' />-permissions

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Dependency Status][daviddm-image]][daviddm-url]

## Install
```sh
$ npm install lodash sails-auth sails-permissions --save
```

## Usage

### 1. configure sailsrc

```json
{
  "generators": {
    "modules": {
      "permissions-api": "sails-permissions",
      "auth-api": "sails-auth"
    }
  }
}
```

### 2. run generator

```sh
$ sails generate permissions-api
```

### 3. Set environment variables

| variable | description | default |
|:---|:---|:---|
| `ADMIN_USERNAME` | admin username | `admin` |
| `ADMIN_EMAIL` | admin user email address | `admin@example.com` |
| `ADMIN_PASSWORD` | admin user password | `admin1234` |

#### 4. update configs

#### config/policies.js
```js
  '*': [
    'basicAuth',
    'passport',
    'sessionAuth',
    'ModelPolicy',
    'OwnerPolicy',
    'PermissionPolicy',
    'RolePolicy'
  ],

  AuthController: {
    '*': true
  }
```

## License
MIT

[sails-logo]: http://cdn.tjw.io/images/sails-logo.png
[sails-url]: https://sailsjs.org
[npm-image]: https://img.shields.io/npm/v/sails-permissions.svg?style=flat-square
[npm-url]: https://npmjs.org/package/sails-permissions
[travis-image]: https://img.shields.io/travis/tjwebb/sails-permissions.svg?style=flat-square
[travis-url]: https://travis-ci.org/tjwebb/sails-permissions
[daviddm-image]: http://img.shields.io/david/tjwebb/sails-permissions.svg?style=flat-square
[daviddm-url]: https://david-dm.org/tjwebb/sails-permissions
