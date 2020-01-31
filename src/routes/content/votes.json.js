export async function get(req, res, next) {

  let values = [req.session.user.id]
  const ids = req.query.contentId.split(",")
  const params = ids.map((i,idx)=>`$${idx+(values.length+1)}`)
  values = values.concat(ids)

  const query = {
    // give the query a unique name
    name: 'fetch-content-user-votes',
    text: `SELECT user_id, content_id, vote FROM content_votes WHERE user_id = $1 AND content_id IN (${params.join(',')})`,
    values,
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


export async function post(req, res, next) {

  const query = {
    // give the query a unique name
    name: 'submit-content-vote',
    text: 'INSERT INTO content_votes (user_id, content_id, vote) VALUES ($1, $2, $3) ON CONFLICT (user_id, content_id) DO UPDATE SET vote = EXCLUDED.vote RETURNING *',
    values: [req.session.user.id, req.body.contentId, req.body.vote],
  }

  const scoreQuery = {
    name: 'fetch-content-score',
    text: 'SELECT content_id, sum(vote) as score FROM content_votes WHERE user_id = $1 AND content_id = $2 GROUP BY content_id',
    values: [req.session.user.id, req.body.contentId],
  }

  let score
	try {
    const client = await req.db.connect()
    let dbRes = await client.query(query)
    const { vote } = dbRes.rows[0]
    dbRes = await client.query(scoreQuery)
    score = {...dbRes.rows[0], vote }

    client.release()
	} catch(e){
    console.log(e)
  }

	if(!score){
		res.writeHead(404, {
			'Content-Type': 'application/json'
		});

		return res.end(JSON.stringify({
			message: `Error`
		}));
	}

	res.writeHead(200, {
		'Content-Type': 'application/json'
	});

  res.end(JSON.stringify(score))
}