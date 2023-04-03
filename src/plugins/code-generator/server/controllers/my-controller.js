'use strict';

module.exports = {
  index(ctx) {
    ctx.body = strapi
      .plugin('code-generator')
      .service('myService')
      .getWelcomeMessage()
  },
};
