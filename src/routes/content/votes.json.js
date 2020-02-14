import snoowrap from 'snoowrap'

export async function get(req, res, next) {

  let values = [req.session.user.id]
  const ids = req.query.contentId.split(",")
  const params = ids.map((i,idx)=>`$${idx+(values.length+1)}`)
  values = values.concat(ids)

  // console.log(values)

  const query = {
    // give the query a unique name
    name: `fetch-content-user-votes_count:${ids.length}`,
    text: `SELECT user_id, content_id, vote FROM content_votes WHERE user_id = $1 AND content_id IN (${params.join(',')})`,
    values,
  }

	let votes
	try {
    const client = await req.db.connect()
    let dbRes = await client.query(query)
    votes = dbRes.rows
    client.release()
	} catch(e){
    console.log(e)
  }

	if(!votes){
		res.writeHead(404, {'Content-Type': 'application/json'});
		return res.end(JSON.stringify({message: `Not found`}));
	}

	res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(votes))
}


export async function post(req, res, next) {

  if(![-1,0,1].includes(req.body.vote)){
		res.writeHead(404, {
			'Content-Type': 'application/json'
		});

		return res.end(JSON.stringify({
			message: `Bad vote parameter`
		}));
  }

  const query = {
    // give the query a unique name
    name: 'submit-user-content-vote',
    text: 'INSERT INTO content_votes (user_id, content_id, vote) VALUES ($1, $2, $3) ON CONFLICT (user_id, content_id) DO UPDATE SET vote = EXCLUDED.vote RETURNING *',
    values: [req.session.user.id, req.body.contentId, req.body.vote],
  }

  const scoreQuery = {
    name: 'fetch-user-content-score',
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

  if(req.session.user.redditAccess){
    const r = new snoowrap({
      userAgent: 'daonuts',
      clientId: process.env.REDDIT_APP_CLIENT_ID,
      clientSecret: process.env.REDDIT_APP_CLIENT_SECRET,
      refreshToken: req.session.user.redditAccess.refresh_token
    });
    if(req.body.vote > 0)
      await r.getSubmission(req.body.contentId).upvote()
    else if(req.body.vote < 0)
      await r.getSubmission(req.body.contentId).downvote()
    else
      await r.getSubmission(req.body.contentId).unvote()
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
