var fs = require('fs'),
    path = require('path'),
    files = [];

// Helper which gets a file content
function getFile(filepath) {
    try {
        fs.accessSync(filepath, fs.F_OK);
    } catch(e) {
        return null;
    }
    return fs.readFileSync(filepath, 'utf-8').trim();
}

function sync (text, options) {
	var i, len, list, file, filepath,
        fileRoot = options ? options.root : '',
        includeRE = /<!--#include\s+(?:virtual|file)="(?:(buffer):)?(\S+)"\s*-->/gi;

    while ((list = includeRE.exec(text)) !== null) {
        if (list.index === includeRE.lastIndex) {
            includeRE.lastIndex += 1;
        }
        filepath = path.join(fileRoot, list[2]);
        if (files.indexOf(filepath) < 0) {
            files.push(filepath);
            file = getFile(filepath);
            if (typeof file === 'string') {
                text = text.replace(new RegExp(list[0], 'gi'), file);
            }
        }
    }

    return text;
};

module.exports = function (text, options) {
    var lastArgument = arguments[arguments.length - 1],
    cb = typeof lastArgument === 'function' ? lastArgument : null,
    data = sync(text, options);

    if (cb) {
        if (data instanceof Error) {
            cb(data);
        } else {
            cb(null, data);
        }
    }
};

module.exports.sync = sync;
