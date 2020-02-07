import fetch from 'node-fetch'
import FormData from 'form-data'
import redirect from '@polka/redirect'

export async function get(req, res, next) {
  console.log(req.query)
  const returnURI = req.session.returnURI
  delete req.session.returnURI
  if(!req.query.error && req.session.user){
    const clientBasicAuth = Buffer.from(`${process.env.REDDIT_APP_CLIENT_ID}:${process.env.REDDIT_APP_CLIENT_SECRET}`).toString('base64')
    var form = new FormData()
    form.append('code', req.query.code)
    form.append('grant_type', 'authorization_code')
    form.append('redirect_uri', `${req.headers.referer}callback`)
    const redditRes = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${clientBasicAuth}`,
        'Accept': 'application/json'
      },
      body: form
    })
    req.session.user.redditAccess = await redditRes.json()
  }
  redirect(res, returnURI)
}
