var path = require('path'),
	gutil = require('gulp-util'),
	through = require('through2'),
	oAssign = require('object-assign'),
	ssiparser = require('./lib/ssiparser');

var PLUGIN_NAME = 'gulp-ssi';

module.exports = function (options) {
	return through.obj(function (file, enc, cb) {
		var self = this,
			cfg = {
				root: path.dirname(file.path),
				fileName: path.basename(file.path)
			};

		if (typeof options === 'object') {
			cfg = oAssign(cfg, options);
		}

		if (file.isStream()) {
			this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streams are not supported!'));
			return cb();
		}

		if (file.isNull()) {
			return cb();
		}

		ssiparser(file.contents.toString(), cfg, function (err, data) {
			if (err) {
				self.emit('error', new gutil.PluginError(PLUGIN_NAME, err, {fileName: file.path}));
				return cb();
			}

			if (data) {
				if (file.isBuffer()) {
					file.contents = new Buffer(data);
				}
				self.push(file);
			}

			cb();
		});
	});
};
