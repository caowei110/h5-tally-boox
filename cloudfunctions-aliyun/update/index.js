'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
  const collection = db.collection(event.dbname)
  // const docList = await collection.limit(1).get();
  
  const res = await collection.doc(event.id).update(event.data);
  return res;
};
