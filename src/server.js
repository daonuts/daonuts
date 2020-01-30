import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import { Pool } from 'pg'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
const pool = new Pool({connectionString: process.env.DB_URL})

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

async function main(){
	polka() // You can also use Express
		.use(
			json(),
			sirv('static', { dev }),
			compression({ threshold: 0 }),
			(req,res,n)=>{req.db=pool;n()},
			cookieSession({name: 'session', secret: 'keyboard kittens'}),
			sapper.middleware({
				session: (req, res) => ({
					user: req.session.user
				})
			})
		)
		.listen(PORT, err => {
			if (err) console.log('error', err);
		});
}
main()
