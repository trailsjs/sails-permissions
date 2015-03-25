# <img src="http://cdn.tjw.io/images/sails-logo.png" height='43px' />-permissions

[![Join the chat at https://gitter.im/tjwebb/sails-permissions](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/tjwebb/sails-permissions?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Dependency Status][daviddm-image]][daviddm-url]

Comprehensive sails.js user permissions and entitlements system. Supports user authentication with passport.js, role-based permissioning, object ownership, and row-level security.

## Install
```sh
$ npm install sails-permissions --save
```

## Quickstart

**Note:** Complete documentation available in the sails-permissions wiki: https://github.com/tjwebb/sails-permissions/wiki

### 1. configure sailsrc

```json
{
  "generators": {
    "modules": {
      "permissions-api": "sails-permissions"
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
    'AuditPolicy',
    'OwnerPolicy',
    'PermissionPolicy',
    'RolePolicy'
  ],

  AuthController: {
    '*': [ 'passport' ]
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
