import { byAddress, byUsername } from '../../utils/getUsers'

export async function get(req, res, next) {
  let users
  if(req.query.address){
    users = await byAddress(req.db, req.query.address.split(","))
  } else if(req.query.username){
    users = await byUsername(req.db, req.query.username.split(","))
  } else {
		res.writeHead(422, {'Content-Type': 'application/json'});
		return res.end(JSON.stringify({message: `Missing query parameter`}));
	}

	if(!users.length){
		res.writeHead(404, {'Content-Type': 'application/json'});
		return res.end(JSON.stringify({message: `Not found`}));
	}

	res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(users))
}
