//根据id查记录

'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const collection = db.collection(event.dbname)
	
	var  res = await collection.doc(event.id).get()
	
	return res
};
