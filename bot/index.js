const Web3 = require('web3')
const { ethers } = require('ethers')
const { BigNumber, utils, constants } = ethers
const { toUtf8String, hexStripZeros, defaultAbiCoder, hexDataSlice, Fragment, Interface, formatBytes32String, parseBytes32String, toUtf8Bytes, hexlify, hexZeroPad } = utils
const Promise = require('bluebird')
const { Pool } = require('pg')
const pool = new Pool({connectionString: process.env.DB_URL})
const BurnABI = require('./abi/Burn.json').abi
const TokenABI = require('./abi/Token.json').abi

const web3 = new Web3(`wss://${process.env.NETWORK}.infura.io/ws/v3/${process.env.INFURA_PROJECT_ID}`)

const burn = new web3.eth.Contract(BurnABI, process.env.BURN_ADDRESS)
const token = new web3.eth.Contract(TokenABI, process.env.TOKEN_ADDRESS)

let daonutsCreditV1Frag = Fragment.from({
    "name": "daonutsCreditV1",
    "type": "function"
})
let ifaceV1 = new Interface([daonutsCreditV1Frag])

main()

async function main(){
  const startBlock = await burn.methods.getInitializationBlock().call()
  console.log("startBlock:", startBlock)
  let events = await token.getPastEvents('Sent', {fromBlock: startBlock})
  await Promise.each(events, notify)
  token.events.Sent({fromBlock:'latest'})
    .on('data', notify)
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

  const client = await pool.connect()

  const values = ["ethtrader", _from.toLowerCase(), amount, transactionHash]

  const queryAddBurnCredit = {
    // give the query a unique name
    name: 'add-burn-credit',
    text: 'SELECT * FROM add_burn_credit($1, $2, $3, $4)',
    values,
  }

  try {
    res = await client.query(queryAddBurnCredit)
  } catch(e){
    console.log(e.code, e.message)
    client.release()
    return
  }

  client.release()
}
