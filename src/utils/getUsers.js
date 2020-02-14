async function byAddress(db, addresses){

  addresses = addresses.map(s=>s.toLowerCase())

  const query = {
    // give the query a unique name
    name: `fetch-user-by-address_count:${addresses.length}`,
    text: `SELECT id, username, address FROM users WHERE lower(address) IN (${addresses.map((i,idx)=>`$${idx+1}`).join(',')})`,
    values: addresses,
  }

	let users
	try {
    const client = await db.connect()
    let dbRes = await client.query(query)
    users = dbRes.rows
    client.release()
	} catch(e){
    console.log(e)
  }

  return users
}

async function byUsername(db, usernames){

  usernames = usernames.map(s=>s.toLowerCase())

  const query = {
    // give the query a unique name
    name: `fetch-user-by-username_count:${usernames.length}`,
    text: `SELECT id, username, address FROM users WHERE lower(username) IN (${usernames.map((i,idx)=>`$${idx+1}`).join(',')})`,
    values: usernames,
  }

	let users
	try {
    const client = await db.connect()
    let dbRes = await client.query(query)
    users = dbRes.rows
    client.release()
	} catch(e){
    console.log(e)
  }

  return users
}

export {
  byAddress,
  byUsername
}
