//加触底刷新功能 分页查询{name: 'get',data:{dbname:'bill',userInfo:{phone_num:1111,pwd,2222}}}
'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const collection = db.collection(event.dbname)
	const dbCmd = db.command

	var res;
	if (event.userInfo) {
		res = await collection.where({
			phone_num: dbCmd.eq(event.userInfo.phone_num),
			pwd: dbCmd.eq(event.userInfo.pwd),
		}).get()
	} else {
		res ={}
	}


	return res
};