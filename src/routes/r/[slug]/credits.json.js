export async function get(req, res, next) {
	// the `slug` parameter is available because
	// this file is called [slug].json.js
	const subreddit = req.params.slug.toLowerCase()
	const address = req.query.address.toLowerCase()

  const query = {
    // give the query a unique name
    name: 'fetch-burn-credits',
    text: 'SELECT * FROM burn_credits WHERE subreddit = $1 AND address = $2 LIMIT 1',
    values: [subreddit, address],
  }

	let credit
	try {
    const client = await req.db.connect()
    let dbRes = await client.query(query)
    credit = dbRes.rows[0]

    client.release()
	} catch(e){

  }

	res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(credit))
}
