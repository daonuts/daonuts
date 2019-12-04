import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import { Pool } from 'pg'
const pool = new Pool({connectionString: process.env.DB_URL})

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

function dbMiddleware(req,res,next){
	req.dbPool = pool
	next()
}

async function main(){
	polka() // You can also use Express
		.use(
			compression({ threshold: 0 }),
			sirv('static', { dev }),
			dbMiddleware,
			sapper.middleware()
		)
		.listen(PORT, err => {
			if (err) console.log('error', err);
		});
}
main()
