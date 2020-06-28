const jsonPath = require('jsonpath')

function walk(raw, path, result, key, context, seekingArray, arrayIndex) {
    let fn;

    switch (type(path)) {
        case 'string':
            fn = seekSingle;
            break;

        case 'array':
            fn = seekArray;
            break;

        case 'object':
            fn = seekObject;
            break;

        case 'function':
            fn = function (raw, path, result, key, context, seekingArray, arrayIndex) {
                result[key] = path(context, raw, jsonPath)
            };
            break;
    }

    if (fn) {
        fn(raw, path, result, key, context, seekingArray, arrayIndex);
    }
}

function type(obj) {
    return Array.isArray(obj) ? 'array' : typeof obj;
}

function query(data, path) {
    const r = /(.*?)\[\]$/
    const greedyMatcher = r.exec(path);
    const seek = jsonPath.query(data, greedyMatcher ? greedyMatcher[1] : path) || [];
    return greedyMatcher ? seek : seek[0]
}

function seekSingle(raw, pathStr, result, key, context, seekArray, arrayIndex) {
    if (seekArray && pathStr.indexOf('@') === 0) {
        const seek = jsonPath.query(context, '$' + pathStr.slice(1)) || [];
        result[key] = seek.length ? seek[0] : undefined;
        return
    }
    if (pathStr.indexOf('$') !== 0) {
        result[key] = pathStr;
    } else {
        result[key] = query(raw, pathStr)
    }
}

function seekArray(raw, pathArr, result, key, context, seekArray) {
    const subpath = pathArr[1];
    const path = pathArr[0];
    const seek = query(raw, path)

    if (seek.length && subpath) {
        result = result[key] = [];

        seek.forEach(function (item, index) {
            walk(raw, subpath, result, index, item, true, index);
        });
    } else {
        result[key] = seek;
    }
}

function seekObject(raw, pathObj, result, key, context, seekArray, arrayIndex) {
    if (typeof key !== 'undefined') {
        result = result[key] = {};
    }

    Object.keys(pathObj).forEach(function (name) {
        walk(raw, pathObj[name], result, name, context, seekArray, arrayIndex);
    });
}

module.exports = function (data, path) {
    const result = {};
    walk(data, path, result);
    return result;
};