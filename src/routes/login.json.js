export async function get(req, res, next) {
  const query = {
    // give the query a unique name
    name: 'fetch-user-by-address',
    text: 'SELECT id, username, address FROM users WHERE address ILIKE $1 LIMIT 1',
    values: [req.query.address],
  }

  let user
  try {
    const client = await req.db.connect()
    let dbRes = await client.query(query)
    if(dbRes.rows.length)
      user = dbRes.rows[0]
    client.release()
  } catch(e){
    console.log(e)
  }

  console.log(user)

  req.session.user = user

	res.writeHead(200, {
		'Content-Type': 'application/json'
	});

  res.end(JSON.stringify(user))
}
