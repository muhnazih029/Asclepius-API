const { postPrediction, historyPrediction } = require('./handler');

const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: postPrediction,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        maxBytes: 1000000,
      },
    },
  },
  {
    path: '/predict/histories',
    method: 'GET',
    handler: historyPrediction,
  },
];

module.exports = routes;
