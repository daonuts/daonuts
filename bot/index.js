const Web3 = require('web3')
const { ethers } = require('ethers')
const { BigNumber, utils, constants } = ethers
const { toUtf8String, hexStripZeros, defaultAbiCoder, hexDataSlice, Fragment, Interface, formatBytes32String, parseBytes32String, toUtf8Bytes, hexlify, hexZeroPad } = utils
const Promise = require('bluebird')
const low = require('lowdb')
const { Pool } = require('pg')
const pool = new Pool({connectionString: process.env.DB_URL})
const FileAsync = require('lowdb/adapters/FileAsync')
const BurnABI = require('./abi/Burn.json').abi
const TokenABI = require('./abi/Token.json').abi

const adapter = new FileAsync('db.json')
const web3 = new Web3(`wss://${process.env.NETWORK}.infura.io/ws/v3/${process.env.INFURA_PROJECT_ID}`)

const burn = new web3.eth.Contract(BurnABI, process.env.BURN_ADDRESS)
const token = new web3.eth.Contract(TokenABI, process.env.TOKEN_ADDRESS)

let daonutsCreditV1Frag = Fragment.from({
    "name": "daonutsCreditV1",
    "type": "function"
})
let ifaceV1 = new Interface([daonutsCreditV1Frag])

let credits
main()

async function main(){
  const db = await low(adapter)
  credits = db.defaults({ credits: [] }).get('credits')
  const startBlock = await burn.methods.getInitializationBlock().call()
  console.log("startBlock:", startBlock)
  let events = await eventsAfter(startBlock)
  let newEvents = events.filter(unprocessed)
  await Promise.all(newEvents.map(notify))
  token.events.Sent({fromBlock:'latest'})
    .on('data', notify)
}

async function eventsAfter(fromBlock){
  // return await tipping.getPastEvents('Tip', {fromBlock})
  return await token.getPastEvents('Sent', {fromBlock})
}

function unprocessed({transactionHash}){
  let credit = credits.find({transactionHash}).value()
  return !credit
}

async function notify({transactionHash, returnValues}){
  // const {from, to, amount, contentId} = returnValues
  const {_operator, _from, _to, _amount, _data, _operatorData} = returnValues
  let decoded

  if( _to !== process.env.BURN_ADDRESS)
    return
  try {
    decoded = ifaceV1.decodeFunctionData(daonutsCreditV1Frag, _data)
  } catch(e){
    return
  }

  let amount = parseInt(Math.floor(BigNumber.from(_amount).div(constants.WeiPerEther).toNumber()))

  // handle
  await credit("ethtrader", _from, amount)

  await credits.push({transactionHash}).write()
}

async function credit(subreddit, from, amount){
  const client = await pool.connect()
  let userId

  const queryFetchUser = {
    // give the query a unique name
    name: 'fetch-user-by-address',
    text: 'SELECT * FROM users WHERE address ILIKE $1',
    values: [from],
  }
  let res = await client.query(queryFetchUser)

  if(res.rows.length)
    userId = res.rows[0].id
  else {
    console.log(`unknown user: ${from}`)
    return
  }

  console.log(`user_id:${userId} added ${amount}`)

  const queryAddBurnCredit = {
    // give the query a unique name
    name: 'add-burn-credit',
    text: 'SELECT * FROM add_burn_credit($1, $2, $3)',
    values: [subreddit, userId, amount],
  }

  res = await client.query(queryAddBurnCredit)
  client.release()

  return
}
