'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const collection = db.collection(event.dbname)
	const dbCmd = db.command
	const $ = db.command.aggregate
	var res;
	if (event.userid) {
		
		res = await collection.aggregate().match({
				modificat_id: dbCmd.eq(event.userid),
				deal_year:dbCmd.eq(event.mat.year),	
			})
			.group({
				_id: {
					income_type: '$income_type'
				},
				total_amount: $.sum('$amount')

			})
			.end()
	} else {
		res = await collection.aggregate().match({
				deal_year:dbCmd.eq(event.mat.year),	
			})
			.group({
				_id: {
					income_type: '$income_type'
				},
				total_amount: $.sum('$amount')
		
			})
			.end()
	}

	return res
};
