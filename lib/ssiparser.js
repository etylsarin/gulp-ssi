var fs = require('fs'),
    path = require('path'),
    fileCache = [];

// Helper which gets a file content
function getFile(filepath) {
	var fileObj = {
			path: filepath,
			content: null
	};
    try {
        fs.accessSync(filepath, fs.F_OK);
    } catch(e) {
			console.log(e.message);
        return fileObj;
    }
		fileObj.content = fs.readFileSync(filepath, 'utf-8').trim();
		return fileObj;
}

function getCacheIndex(filepath) {
	var i, len;
	for (i = 0, len = fileCache.length; i < len; i += 1) {
		if (fileCache[i].path === filepath) {
			return i;
		}
	}
	return -1;
}

function setFileCache(filepath) {
	var file = getFile(filepath),
		index = fileCache.length;

	fileCache.push(file);
	return index;
}

function sync (text, fileBase, clearCache) {
	var i, len, list, index, file, filepath,
        includeRE = /<!--#\s*include\s+(?:virtual|file)="(\S+)"\s*-->/gi;

        if (clearCache) {
            fileCache = [];
        }

		while ((list = includeRE.exec(text)) !== null) {
        if (list.index === includeRE.lastIndex) {
            includeRE.lastIndex += 1;
        }
        filepath = path.join(fileBase, list[1]);
				index = getCacheIndex(filepath);
        if (index < 0) {
					index = setFileCache(filepath);
        }
				file = fileCache[index];
				if (typeof file.content === 'string') {
						text = text.replace(new RegExp(list[0], 'gi'), file.content);
				}
    }
    return text;
};

module.exports = function (text, fileBase, clearCache) {
    var lastArgument = arguments[arguments.length - 1],
    cb = typeof lastArgument === 'function' ? lastArgument : null,
    data = sync(text, fileBase, clearCache);

    if (cb) {
        if (data instanceof Error) {
            cb(data);
        } else {
            cb(null, data);
        }
    }
};

module.exports.sync = sync;
