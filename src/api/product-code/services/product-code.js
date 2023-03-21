'use strict';

/**
 * product-code service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::product-code.product-code');
