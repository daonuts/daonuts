export async function get(req, res, next) {
  if(req.session.user)
    console.log("logout", req.session.user.id)
    
  req.session = null

  res.end("ok")
}
