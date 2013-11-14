'use strict';

module.exports = function (options) {
    if (!options) {
        options = {};
    }
    var host = options.host || "http://localhost:35729";
    var script = "<script src=\"" + host + "/livereload.js?snipver=1\"></script>";

    return function (req, res, next) {
        var write = res.write;

        res.write = function (chunk, encoding, callback) {
            var length = res.getHeader('content-length');
            var header = res.getHeader('content-type');

            if (header && header.match(/text\/html/) && chunk) {
                chunk = chunk.toString();
                var origLength = chunk.length;
                chunk = chunk.replace(/(<\/body>)/, script + "$1");
                var newLength = chunk.length;

                res.setHeader('content-length', length - (origLength - newLength));
            }
            write.call(res, chunk, encoding, callback);
        };
        next();
    };
};
