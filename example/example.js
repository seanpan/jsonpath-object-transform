const transform = require('../lib/jsonpath-object-transform')

const data = {
  data: {
    products: [{
        title: 'led',
        price: 100,
        img: '//sc.alicdn.com/xxxxxxxx',
        order: {
          min: 200,
          max: 5000
        },
        sku: [2, 4, 6]
      },
      {
        title: 'crystal',
        price: 500,
        img: '//sc.alicdn.com/yyyyy',
        order: {
          min: 100,
          max: 2000
        },
        sku: [1, 2, 3]
      }
    ],
    supplier: {
      name: 'alibaba',
      location: 'China'
    },
    total: 2
  },
  success: true
}

const path = {
  success: '$.success',
  products: ['$.data.products', {
    name: '@.title',
    price: '@.price',
    supplier: {
      name: '$.data.supplier.name',
      country: '$.data.supplier.location'
    },
    minOrder: '@.order.min',
    maxOrder: '@.order.max',
    sku: '@.sku'
  }]
}

console.log(JSON.stringify(transform(data, path), null, 2));