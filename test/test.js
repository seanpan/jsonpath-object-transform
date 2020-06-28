const transform = require('../src/index')
const {
    data,
    books,
    fixedBooks,
    authors,
    authorsObjectShape,
    owners
} = require('./dataset')
const assert = require('chai').assert

describe('JSON transform', function () {
    describe('String Path', function () {
        it('should return first match node when path is single string', function () {
            const path = {
                books: '$.store.books'
            }
            assert.deepEqual(transform(data, path), {
                books: books
            })
        });
        it('should return all match nodes(greedy) when path is single string end with []', function () {
            const path = {
                books: '$.store.books[]'
            }
            assert.deepEqual(transform(data, path), {
                books: [books]
            })
        });
        it('should return all authors list', function () {
            const path = {
                authors: '$.store.books[*].author[]'
            }
            assert.deepEqual(transform(data, path), {
                authors: authors
            })
        });
    });
    describe('Array Path', function () {
        it('should return first match node when path is array with single string inside', function () {
            const path = {
                books: ['$.store.books']
            }
            assert.deepEqual(transform(data, path), {
                books: books
            })
        });
        it('should return all match nodes(greedy) when path is array with single string end with [] inside', function () {
            const path = {
                books: ['$.store.books[]']
            }
            assert.deepEqual(transform(data, path), {
                books: [books]
            })
        });
        it('should return all authors list', function () {
            const path = {
                authors: ['$.store.books[*].author[]']
            }
            assert.deepEqual(transform(data, path), {
                authors: authors
            })
        });
        it('should return all authors list with object shape', function () {
            const path = {
                authors: ['$.store.books', {
                    author: '@.author'
                }]
            }
            assert.deepEqual(transform(data, path), {
                authors: authorsObjectShape
            })
        });
        it('should return two owner object in a list', function () {
            const path = {
                owners: ['$.store.books', {
                    owner: '$.owner'
                }]
            }
            assert.deepEqual(transform(data, path), {
                owners: owners
            })
        });
        it('should work fine with complex path (both age 30)', function () {
            const path = {
                books: ['$.store.books', {
                    owner: '$.owner',
                    author: '@.author',
                    age: '$.store.books..age'
                }]
            }
            assert.deepEqual(transform(data, path), {
                books: fixedBooks
            })
        });
    });
    describe('Array-Function Path', function () {
        it('should return first match node when path is single string', function () {
            const path = {
                authors: ['$.store.books', function (node) {
                    return {
                        author: node.author
                    }
                }]
            }
            assert.deepEqual(transform(data, path), {
                authors: authorsObjectShape
            })
        });
    });
});