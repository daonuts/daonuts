export async function get(req, res, next) {
  console.log("query", req.query)

  const query = {
    // give the query a unique name
    name: 'fetch-user-by-address',
    text: 'SELECT id, username, address FROM users WHERE address ILIKE $1 LIMIT 1',
    values: [req.query.address],
  }

	let user
	try {
    const client = await req.dbPool.connect()
    let dbRes = await client.query(query)
    if(dbRes.rows.length)
      user = dbRes.rows[0]
    client.release()
	} catch(e){
    console.log(e)
  }

	if(!user){
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

  res.end(JSON.stringify(user))
}
