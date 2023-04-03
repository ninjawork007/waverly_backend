module.exports = {
  routes: [
    { // Path defined with a URL parameter
      method: 'POST',
      path: '/product-codes/generate',
      handler: 'product-code.generate',
    },
    { // Path defined with a URL parameter
      method: 'POST',
      path: '/product-codes/authenticate',
      handler: 'product-code.authenticate',
    },
    { // Path defined with a URL parameter
      method: 'POST',
      path: '/product-codes/upload',
      handler: 'product-code.upload',
    }
  ]
}
