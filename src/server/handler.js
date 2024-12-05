const predictClassification = require('../service/inferenceService');
const storeData = require('../service/storeData');
const getAllData = require('../service/getData');
const crypto = require('crypto');

async function postPrediction(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  const id = crypto.randomUUID();
  const { result, suggestion } = await predictClassification(model, image);
  const createdAt = new Date().toISOString();
  const data = {
    id,
    result,
    suggestion,
    createdAt,
  };

  await storeData(id, data);
  const response = h.response({
    status: 'success',
    message: 'Model is predicted successfully',
    data: data,
  });
  response.code(201);
  return response;
}

async function historyPrediction(request, h) {
  const allData = await getAllData();
  const data = [];
  allData.forEach((doc) => {
    const history = {
      id: doc.id,
      history: {
        result: doc.result,
        createdAt: doc.createdAt,
        suggestion: doc.suggestion,
        id: doc.id,
      },
    };
    data.push(history);
  });
  const response = h.response({
    status: 'success',
    data: data,
  });
  response.code(200);
  return response;
}

module.exports = {
  postPrediction,
  historyPrediction,
};
