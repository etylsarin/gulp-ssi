var path = require('path'),
	gutil = require('gulp-util'),
	through = require('through2'),
	ssiparser = require('./lib/ssiparser');

var PLUGIN_NAME = 'gulp-ssi';

module.exports = function (options) {
	var freshRun = true;
	return through.obj(function (file, enc, cb) {
		var self = this,
			cfg = path.parse(path.relative(file.base, file.path));

		cfg.root = path.relative(file.cwd, file.base);

		if (typeof options === 'object' && typeof options.root === 'string') {
			cfg.root = options.root;
		}

		if (file.isStream()) {
			this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streams are not supported!'));
			return cb();
		}

		if (file.isNull()) {
			return cb();
		}
		ssiparser(file.contents.toString(), path.join(cfg.root, cfg.dir), freshRun, function (err, data) {
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

		freshRun = false;
	});
};
