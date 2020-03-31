async function getStakes(db, ids){

  const query = {
    // give the query a unique name
    name: `fetch-content-stakes:${ids.length}`,
    text: `SELECT content_id, user_id FROM content_stakes WHERE content_id IN (${ids.map((i,idx)=>`$${idx+1}`).join(',')})`,
    values: ids,
  }

	let stakes
	try {
    const client = await db.connect()
    let dbRes = await client.query(query)
    // if(dbRes.rows.length)
    stakes = dbRes.rows
    client.release()
	} catch(e){
    console.log(e)
  }

  return stakes
}

export default getStakes
