import snoowrap from 'snoowrap'
import getScores from '../../../utils/getScores'
import getStakes from '../../../utils/getStakes'
import { byUsername } from '../../../utils/getUsers'

const reddit = new snoowrap({
  userAgent: 'daonuts 1.0 by u/daonuts',
  clientId: process.env.REDDIT_SCRIPT_CLIENT_ID,
  clientSecret: process.env.REDDIT_SCRIPT_CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD
})

export async function get(req, res, next) {
	// the `slug` parameter is available because
	// this file is called [slug].json.js
	const slug = req.params.slug.toLowerCase()
  const type = req.query.type || 'member'

	let feed
	try {
		// feed = await reddit.getSubreddit(slug).getHot({limit: 100})
    let options = {}
    if(req.query.after) options.after = req.query.after
    if(type === 'new')
		  feed = await reddit.getSubreddit(slug).getNew(options)
    else
		  feed = await reddit.getSubreddit(slug).getHot(options)
	} catch(e){}

	if(!feed){
		res.writeHead(404, {'Content-Type': 'application/json'});
		return res.end(JSON.stringify({message: `Not found`}));
	}

  const scores = await getScores(req.db, feed.map(p=>p.name))
  const stakes = await getStakes(req.db, feed.map(p=>p.name))
  const users = await byUsername(req.db, Array.from(new Set(feed.map(p=>p.author.name))))

  feed.forEach(post=>{
    let s = scores.find(s=>s.content_id===post.name)
    if(s) post.daonuts_score = s.score
    let stake = stakes.find(s=>s.content_id===post.name)
    if(stake) post.daonuts_staker = stake.user_id
    let u = users.find(u=>u.username===post.author.name)
    if(u) post.daonuts_address = u.address
  })

  if(type === 'member'){
    feed = feed.filter(post=>!post.daonuts_score || post.daonuts_score>=0)
  }

	res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(feed))
}
