const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
  try {
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    const predict = model.predict(tensor);
    const score = await predict.data();
    const confidenceScore = Math.max(...score) * 100;

    let result, suggestion;
    if (confidenceScore > 50) {
      result = 'Cancer';
      suggestion = 'Segera periksa ke dokter!';
    } else {
      result = 'Non-cancer';
      suggestion = 'Penyakit kanker tidak terdeteksi.';
    }
    return { result, suggestion };
  } catch (error) {
    throw new InputError(`Terjadi kesalahan input: ${error.message}`);
  }
}

module.exports = predictClassification;
