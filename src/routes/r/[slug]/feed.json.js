import snoowrap from 'snoowrap'

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

	let hot
	try {
		hot = await reddit.getSubreddit(slug).getHot({limit: 100})
	} catch(e){}

	if(!hot){
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

  res.end(JSON.stringify(hot))
	// if (lookup.has(slug)) {
	// 	res.end(JSON.stringify(Object.assign(sub, lookup.get(slug))))
	// } else {
	// 	res.end(JSON.stringify(sub))
	// }

}
