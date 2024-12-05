const { Firestore } = require('@google-cloud/firestore');

async function getAllData() {
  const db = new Firestore();
  const predictCollection = db.collection('predictions');

  const Data = await predictCollection.get();
  return Data;
}

module.exports = getAllData;
