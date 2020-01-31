export async function get(req, res, next) {

  const ids = req.query.contentId.split(",")
  const params = ids.map((i,idx)=>`$${idx+1}`)

  const query = {
    // give the query a unique name
    name: 'fetch-content-scores',
    text: `SELECT content_id, sum(vote) as score FROM content_votes WHERE content_id IN (${params.join(',')}) GROUP BY content_id`,
    values: ids,
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
