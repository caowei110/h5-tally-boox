'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
  const collection = db.collection(event.dbname)
  const res = await collection.doc(event.id).remove();
  return res;
};
