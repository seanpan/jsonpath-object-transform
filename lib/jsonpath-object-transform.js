/*jshint evil:true*/
/*global module, require, define*/

(function (root, factory) {
  'use strict';

  // AMD
  if (typeof define === 'function' && define.amd) {
    define('jsonpathObjectTransform', ['jsonpath'], function (jsonPath) {
      return (root.jsonpathObjectTransform = factory(jsonPath));
    });
  }

  // Node
  else if (typeof exports === 'object') {
    module.exports = factory(require('jsonpath'));
  }

  // Browser global
  else {
    root.jsonpathObjectTransform = factory(root.jsonPath);
  }
}(this, function (jsonPath) {
  'use strict';

  /**
   * Step through data object and apply path transforms.
   *
   * @param {object} data
   * @param {object} path
   * @param {object} result
   * @param {string} key
   */
  function walk(raw, path, result, key, context, seekingArray, arrayIndex) {
    const fn;

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

  /**
   * Determine type of object.
   *
   * @param {object} obj
   * @returns {string}
   */
  function type(obj) {
    return Array.isArray(obj) ? 'array' : typeof obj;
  }

  /**
   * Get single property from data object.
   *
   * @param {object} data
   * @param {string} pathStr
   * @param {object} result
   * @param {string} key
   */
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

  function query(data, path) {
    const r = /(.*?)\[\]$/
    const greedyMatcher = r.exec(path);
    const seek = jsonPath.query(data, greedyMatcher ? greedyMatcher[1] : path) || [];
    return greedyMatcher ? seek : seek[0]
  }

  /**
   * Get array of properties from data object.
   *
   * @param {object} data
   * @param {array} pathArr
   * @param {object} result
   * @param {string} key
   */
  function seekArray(raw, pathArr, result, key, context, seekArray) {
    const subpath = pathArr[1];
    const path = pathArr[0];
    // const seek = jsonPath.query(raw, path) || [];
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

  /**
   * Get object property from data object.
   *
   * @param {object} data
   * @param {object} pathObj
   * @param {object} result
   * @param {string} key
   */
  function seekObject(raw, pathObj, result, key, context, seekArray, arrayIndex) {
    if (typeof key !== 'undefined') {
      result = result[key] = {};
    }

    Object.keys(pathObj).forEach(function (name) {
      walk(raw, pathObj[name], result, name, context, seekArray, arrayIndex);
    });
  }

  /**
   * @module jsonpath-object-transform
   * @param {object} data
   * @param {object} path
   * @returns {object}
   */
  return function (data, path) {
    const result = {};

    walk(data, path, result);

    return result;
  };

}));