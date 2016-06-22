# gulp-ssi
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

> Server Side Includes parser plugin for [gulp](https://github.com/wearefractal/gulp)

## Usage

First, install `gulp-ssi` as a development dependency:

```shell
npm install --save-dev gulp-ssi
```

Then, add it to your `gulpfile.js`:

```javascript
var ssi = require("gulp-ssi");

gulp.src("./src/*.ext")
	.pipe(ssi())
	.pipe(gulp.dest("./dist"));
```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/gulp-ssi
[npm-image]: https://badge.fury.io/js/gulp-ssi.png

[travis-url]: http://travis-ci.org/etylsarin/gulp-ssi
[travis-image]: https://secure.travis-ci.org/etylsarin/gulp-ssi.png?branch=master
