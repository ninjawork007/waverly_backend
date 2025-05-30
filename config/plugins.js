module.exports = ({ env }) => ({
  // ...
  'code-generator': {
    enabled: true,
    resolve: './src/plugins/code-generator' // path to plugin folder
  },
  'code-uploader': {
    enabled: true,
    resolve: './src/plugins/code-uploader' // path to plugin folder
  },
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        accessKeyId: env('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env('AWS_ACCESS_SECRET'),
        region: env('AWS_REGION'),
        params: {
          Bucket: env('AWS_BUCKET'),
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
});
