# <img src="http://cdn.tjw.io/images/sails-logo.png" height='43px' />-permissions

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Dependency Status][daviddm-image]][daviddm-url]

## Install
```sh
$ npm install sails-permissions --save
```

## Usage

#### 1. update .sailsrc
```json
{
  "generators": {
    "permissions-api": "sails-permissions"
  }
}
```

#### 2. run generator
```sh
$ sails generate permissions-api
```

The permissions api creates a default 'admin **User** in the datastore. It
requires that the following values are set:
- `sails.config.permissions.adminEmail`
- `sails.config.permissions.adminPassword`


## License
MIT

[sails-logo]: http://cdn.tjw.io/images/sails-logo.png
[sails-url]: https://sailsjs.org
[npm-image]: https://img.shields.io/npm/v/sails-permissions.svg?style=flat
[npm-url]: https://npmjs.org/package/sails-permissions
[travis-image]: https://img.shields.io/travis/tjwebb/sails-permissions.svg?style=flat
[travis-url]: https://travis-ci.org/tjwebb/sails-permissions
[daviddm-image]: http://img.shields.io/david/tjwebb/sails-permissions.svg?style=flat
[daviddm-url]: https://david-dm.org/tjwebb/sails-permissions
