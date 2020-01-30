export async function get(req, res, next) {
  console.log("query", req.query)

  const query = {
    // give the query a unique name
    name: 'fetch-content-scores',
    text: 'SELECT content_id, sum(votes) FROM content_votes WHERE content_id IN $1 GROUP_BY content_id',
    values: [req.query.contentId.split(",")],
  }

	let scores
	try {
    const client = await req.db.connect()
    let dbRes = await client.query(query)
    if(dbRes.rows.length)
      scores = dbRes.rows
    client.release()
	} catch(e){
    console.log(e)
  }

	if(!scores){
		res.writeHead(404, {
			'Content-Type': 'application/json'
		});

		return res.end(JSON.stringify({
			message: `Not found`
		}));
	}

	res.writeHead(200, {
		'Content-Type': 'application/json'
	});

  res.end(JSON.stringify(scores))
}
