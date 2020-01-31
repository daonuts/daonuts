export async function get(req, res, next) {
  console.log("before nulling", req.session)
  req.session = null
  console.log("logout", req.session)

  res.end("ok")
}
