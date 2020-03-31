export async function get(req, res, next) {
	// the `slug` parameter is available because
	// this file is called [slug].json.js
	const subreddit = req.params.slug.toLowerCase()

  const query = {
    // give the query a unique name
    name: 'submit-content-stake',
    text: 'SELECT * FROM burn_credits WHERE subreddit = $1 AND user_id = $2 LIMIT 1',
    values: [subreddit, req.session.user.id],
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
