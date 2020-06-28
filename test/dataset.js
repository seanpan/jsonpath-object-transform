module.exports = {
    data: {
        store: {
            books: [{
                    author: 'Sean Pan',
                    age: '30'
                },
                {
                    author: 'Jack Wong',
                    age: '50'
                }
            ]
        },
        owner: 'Paul Lee'
    },
    books: [{
            author: 'Sean Pan',
            age: '30'
        },
        {
            author: 'Jack Wong',
            age: '50'
        }
    ],
    fixedBooks: [{
            author: 'Sean Pan',
            age: '30',
            owner: 'Paul Lee'
        },
        {
            author: 'Jack Wong',
            age: '30',
            owner: 'Paul Lee'
        }
    ],
    authors: ['Sean Pan', 'Jack Wong'],
    authorsObjectShape: [{
            author: 'Sean Pan'
        },
        {
            author: 'Jack Wong'
        }
    ],
    owners: [{
            owner: 'Paul Lee'
        },
        {
            owner: 'Paul Lee'
        }
    ]
}