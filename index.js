var path = require('path'),
	gutil = require('gulp-util'),
	through = require('through2'),
	oAssign = require('object-assign'),
	ssiparser = require('./lib/ssiparser');

var PLUGIN_NAME = 'gulp-ssi';

module.exports = function (options) {
	var freshRun = true;
	return through.obj(function (file, enc, cb) {
		var self = this,
			ext = path.extname(file.path).slice(1),
			cfg = {
				root: path.dirname(file.path),
				fileName: path.basename(file.path)
			};

		if (typeof options === 'object') {
			cfg = oAssign(cfg, options);
		}
		
		cfg = oAssign(cfg, {relative: path.dirname(file.path)});
		
		if (file.isStream()) {
			this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streams are not supported!'));
			return cb();
		}

		if (file.isNull()) {
			return cb();
		}

		ssiparser(file.contents.toString(), cfg, freshRun, function (err, data) {
			if (err) {
				self.emit('error', new gutil.PluginError(PLUGIN_NAME, err, {fileName: file.path}));
				return cb();
			}

			if (data) {
				if (file.isBuffer()) {
					file.contents = new Buffer(data);
					if (cfg.ext && ext !== cfg.ext) {
						file.path = file.path.slice(0, -(ext.length));
						file.path += cfg.ext;
					}
				}
				self.push(file);
			}

			cb();
		});

		freshRun = false;
	});
};
