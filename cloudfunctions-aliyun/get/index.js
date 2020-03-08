//加触底刷新功能 分页查询{name: 'get',data:{dbname:'bill',page:{current:1,size:10},mat:{year:2018,month:9}}}
'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const collection = db.collection(event.dbname)
	const dbCmd = db.command
	var offset = (event.page.current - 1) * event.page.size
	var res;
	if (event.userid && event.userid != '' && event.page) {
		res = await collection.where({
			modificat_id: dbCmd.eq(event.userid),
			deal_year: dbCmd.eq(event.mat.year),
			deal_month: dbCmd.eq(event.mat.month),
		}).orderBy("_id", "desc").skip(offset).limit(event.page.size).get()
	} else {
		if (event.page) {
			res = await collection.where({
				deal_year: dbCmd.eq(event.mat.year),
				deal_month: dbCmd.eq(event.mat.month)}
			).orderBy("_id", "desc").skip(offset).limit(event.page.size).get()
		} else {
			res = await collection.orderBy("_id", "desc").get()
		}
	}


	return res
};
