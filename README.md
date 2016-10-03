# sails-permissions

[![Looking for maintainers][hacktober-image]][hacktober-url]

[![Gitter][gitter-image]][gitter-url]
[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Dependency Status][daviddm-image]][daviddm-url]

Comprehensive sails.js user permissions and entitlements system. Supports user authentication with passport.js, role-based permissioning, object ownership, and row-level security.

## Install
```sh
$ npm install sails-permissions sails-auth --save
```

## Quickstart

**Note:** Complete documentation available in the sails-permissions wiki: https://github.com/langateam/sails-permissions/wiki

### 1. configure sailsrc

```json
{
  "generators": {
    "modules": {
      "permissions-api": "sails-permissions/generator"
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

##### e.g in config/local.js (file is in .gitignore)
```
sails.config.permissions.adminUsername = 'admin'
sails.config.permissions.adminEmail = 'admin@example.com'
sails.config.permissions.adminPassword = 'admin1234'
```
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
    'RolePolicy',
    'CriteriaPolicy'
  ],

  AuthController: {
    '*': [ 'passport' ]
  }
```

#### 5. Login
You can now login using the aforementioned default login data or the admin settings you specified using the `/auth/local` endpoint.
```json
{
    "identifier": "admin@example.com",
    "password": "admin1234"
}
```

## License
MIT

## Maintained By
[<img src='http://i.imgur.com/Y03Jgmf.png' height='64px'>](http://langa.io)

[npm-image]: https://img.shields.io/npm/v/sails-permissions.svg?style=flat-square
[npm-url]: https://npmjs.org/package/sails-permissions
[travis-image]: https://img.shields.io/travis/langateam/sails-permissions.svg?style=flat-square
[travis-url]: https://travis-ci.org/langateam/sails-permissions
[daviddm-image]: http://img.shields.io/david/langateam/sails-permissions.svg?style=flat-square
[daviddm-url]: https://david-dm.org/langateam/sails-permissions
[gitter-image]: http://img.shields.io/badge/+%20GITTER-JOIN%20CHAT%20%E2%86%92-1DCE73.svg?style=flat-square
[gitter-url]: https://gitter.im/langateam/sails-permissions

[hacktober-image]: http://i.imgur.com/FM9yVCI.png
[hacktober-url]: https://twitter.com/langateam/status/782995392212369408
