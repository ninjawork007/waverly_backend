'use strict';

module.exports = {
  index(ctx) {
    ctx.body = strapi
      .plugin('code-uploader')
      .service('myService')
      .getWelcomeMessage();
  },
};
