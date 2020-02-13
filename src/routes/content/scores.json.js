import getScores from '../../utils/getScores'

export async function get(req, res, next) {

  const scores = await getScores(req.db, req.query.contentId.split(","))

	if(!scores){
    res.writeHead(404, {'Content-Type': 'application/json'});
		return res.end(JSON.stringify({message: `Not found`}));
	}

	res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(scores))
}
