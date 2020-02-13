async function getScores(db,ids){

  const query = {
    // give the query a unique name
    name: `fetch-content-scores_count:${ids.length}`,
    text: `SELECT content_id, sum(vote) as score FROM content_votes WHERE content_id IN (${ids.map((i,idx)=>`$${idx+1}`).join(',')}) GROUP BY content_id`,
    values: ids,
  }

	let scores
	try {
    const client = await db.connect()
    let dbRes = await client.query(query)
    // if(dbRes.rows.length)
    scores = dbRes.rows
    client.release()
	} catch(e){
    console.log(e)
  }
  
  return scores
}

export default getScores
