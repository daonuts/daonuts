import redirect from '@polka/redirect'

export async function get(req, res, next) {
  req.session.returnURI = req.headers.referer
  redirect(res, `https://www.reddit.com/api/v1/authorize?client_id=${process.env.REDDIT_APP_CLIENT_ID}&response_type=code&state=${Math.random().toFixed(8)*Math.pow(10,8)}&redirect_uri=${process.env.REDDIT_OAUTH_REDIRECT_URI}&duration=permanent&scope=vote`)
}
