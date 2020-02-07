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
			cookieSession({name: 'session', secret: process.env.SESSION_SECRET}),
			(req,res,n)=>{req.session.nonce = req.session.nonce || Math.floor(Math.random() * Math.pow(10,10));n()},
			authRoutes,
			// leave sapper middleware to last
			sapper.middleware({
				session: (req, res) => ({
					user: req.session.user,
					nonce: req.session.nonce
				})
			})
		)
		.listen(PORT, err => {
			if (err) console.log('error', err);
		});
}
main()

function authRoutes(req, res, next){
	if(["/votes.json"].includes(req.path) && !req.session.user){
    res.writeHead(401, {'Content-Type': 'application/json'});
    return res.end(JSON.stringify({message: `Please login`}));
	}

	next()
}
