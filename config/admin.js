module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'fc8fda5b9a5c7c0ae83106cfd9b28e79'),
  },
});
