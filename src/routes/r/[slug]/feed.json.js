import snoowrap from 'snoowrap'
import getScores from '../../../utils/getScores'

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
    if(type === 'new')
		  feed = await reddit.getSubreddit(slug).getNew()
    else
		  feed = await reddit.getSubreddit(slug).getHot()
	} catch(e){}

	if(!feed){
		res.writeHead(404, {'Content-Type': 'application/json'});
		return res.end(JSON.stringify({message: `Not found`}));
	}

  const scores = await getScores(req.db, feed.map(p=>p.name))
  feed.forEach(post=>{
    let s = scores.find(s=>s.content_id===post.name)
    if(s) post.member_score = s.score
  })

  if(type === 'member'){
    feed = feed.filter(post=>!post.member_score || post.member_score>=0)
  }

	res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(feed))

}
