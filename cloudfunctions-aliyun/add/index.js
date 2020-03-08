'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const collection = db.collection(event.dbname)
	const res = await collection.add(event.data)
	return res
};
