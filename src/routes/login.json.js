import ethers, { utils } from 'ethers'

export async function get(req, res, next) {

  const query = {
    // give the query a unique name
    name: 'fetch-user-by-address',
    text: 'SELECT id, username, address FROM users WHERE address ILIKE $1 LIMIT 1',
    values: [req.query.address],
  }

  let user
  try {
    const client = await req.db.connect()
    let dbRes = await client.query(query)
    if(dbRes.rows.length)
      user = dbRes.rows[0]
    client.release()
  } catch(e){
    console.log(e)
  }

	if(!user){
		res.writeHead(404, {'Content-Type': 'application/json'});

		return res.end(JSON.stringify({
			message: `User not found for address [${req.query.address}]`
		}));
	}

  const msg = `Login ${user.username} ${req.session.nonce}`
  const signingAddress = utils.verifyMessage(msg, req.query.sig)

	if(signingAddress.toLowerCase() !== req.query.address){
		res.writeHead(401, {'Content-Type': 'application/json'});

		return res.end(JSON.stringify({
			message: `Invalid signature`
		}));
	}

  req.session.user = user

  console.log("login", req.session.user.id)

	res.writeHead(200, {'Content-Type': 'application/json'});

  res.end(JSON.stringify(user))
}
