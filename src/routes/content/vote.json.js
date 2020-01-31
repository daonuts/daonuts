export async function post(req, res, next) {

  if(!req.session.user){
    res.writeHead(401, {
      'Content-Type': 'application/json'
    });

    return res.end(JSON.stringify({
      message: `Please login`
    }));
  }

  //validate req.body.vote

  const query = {
    // give the query a unique name
    name: 'submit-content-vote',
    text: 'INSERT INTO content_votes (user_id, content_id, vote) VALUES ($1, $2, $3) ON CONFLICT (user_id, content_id) DO UPDATE SET vote = EXCLUDED.vote RETURNING *',
    values: [req.session.user.id, req.body.contentId, req.body.vote],
  }

  const scoreQuery = {
    name: 'fetch-content-score',
    text: 'SELECT content_id, sum(vote) FROM content_votes WHERE user_id = $1 AND content_id = $2 GROUP BY content_id',
    values: [req.session.user.id, req.body.contentId],
  }

  let userVote, newScore
	try {
    const client = await req.db.connect()
    let dbRes = await client.query(query)
    if(dbRes.rows.length){
      let data = dbRes.rows[0]
    	userVote = data.vote
    }
    dbRes = await client.query(scoreQuery)
    newScore = dbRes.rows[0]
    newScore.userVote = userVote

    client.release()
	} catch(e){
    console.log(e)
  }

	if(!newScore){
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

  res.end(JSON.stringify(newScore))
}
