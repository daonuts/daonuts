import snoowrap from 'snoowrap'
import getStakes from '../../utils/getStakes'

const reddit = new snoowrap({
  userAgent: 'daonuts 1.0 by u/daonuts',
  clientId: process.env.REDDIT_SCRIPT_CLIENT_ID,
  clientSecret: process.env.REDDIT_SCRIPT_CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD
})

export async function get(req, res, next) {

  const stakes = await getStakes(req.db, req.query.contentId.split(","))

	if(!stakes){
    res.writeHead(404, {'Content-Type': 'application/json'});
		return res.end(JSON.stringify({message: `Not found`}));
	}

	res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(stakes))
}

export async function post(req, res, next) {

  // get subreddit from content_id
  const content = await reddit.getSubmission(req.body.contentId).fetch()
  const subreddit = content.subreddit.display_name

  console.log(subreddit)

  const query = {
    // give the query a unique name
    name: 'submit-content-stake',
    text: 'SELECT * FROM content_stake($1, $2, $3, $4)',
    values: [subreddit, 100, req.session.user.id, req.body.contentId],
  }

  let staked, err
	try {
    const client = await req.db.connect()
    let dbRes = await client.query(query)
    staked = dbRes.rows[0]

    client.release()
	} catch(e){
    console.log(e)
    err = e
  }

	if(!staked){
    const code = err.code === '22003' ? 402 : 400
		res.writeHead(code, {
			'Content-Type': 'application/json'
		});

		return res.end(JSON.stringify({ message: err && err.message || `Error` }));
	}

	res.writeHead(200, {
		'Content-Type': 'application/json'
	});

  res.end(JSON.stringify(staked))
}
