const { ethers } = require('ethers')
const AirdropDuoABI = require('../abi/AirdropDuo.json').abi
const CappedVotingABI = require('../abi/CappedVoting.json').abi
const BurnABI = require('../abi/Burn.json').abi
const HarbergerABI = require('../abi/Harberger.json').abi
const KernelABI = require('../abi/Kernel.json').abi
const SubscribeABI = require('../abi/Subscribe.json').abi
const TippingABI = require('../abi/Tipping.json').abi
const TokenABI = require('../abi/Token.json').abi
const TokenManagerABI = require('../abi/TokenManager.json').abi
const { utils, Contract } = ethers
const tokenManagerNamehash = utils.namehash('token-manager.aragonpm.eth')
const apps = {}
apps[utils.namehash('capped-voting-app.open.aragonpm.eth')] = {name: 'voting', abi: CappedVotingABI}
apps[utils.namehash('burn-app.open.aragonpm.eth')] = {name: 'burn', abi: BurnABI}
apps[utils.namehash('harberger-app.open.aragonpm.eth')] = {name: 'harberger', abi: HarbergerABI}
apps[utils.namehash('subscribe-app.open.aragonpm.eth')] = {name: 'subscribe', abi: SubscribeABI}
apps[utils.namehash('tipping-app.open.aragonpm.eth')] = {name: 'tipping', abi: TippingABI}

async function getContracts(daoAddress, provider){
  const kernel = new Contract(daoAddress, KernelABI, provider)
  const fromBlock = (await kernel.getInitializationBlock()).toNumber()
  const toBlock = 'latest'
  const NewAppProxyEvent = kernel.filters.NewAppProxy()
  const logs = await kernel.queryFilter(NewAppProxyEvent, fromBlock, toBlock)
  const contracts = {}
  for (const log of logs) {
    const [address,,appId] = kernel.interface.parseLog(log).values
    if(appId == tokenManagerNamehash){
      if(!contracts['contribManager']) {
        contracts['contribManager'] = new Contract(address, TokenManagerABI, provider)
        contracts['contrib'] = new Contract(await contracts['contribManager'].token(), TokenABI, provider)
      } else {
        contracts['currencyManager'] = new Contract(address, TokenManagerABI, provider)
        contracts['currency'] = new Contract(await contracts['currencyManager'].token(), TokenABI, provider)
      }
    } else if(apps[appId])
      contracts[apps[appId].name] = new Contract(address, apps[appId].abi, provider)
  }
  return contracts
}

// export default getContracts
module.exports = getContracts

if(typeof window === "undefined"){
  let daoAddress;
  try { daoAddress = utils.getAddress(process.argv[2]) } catch (e) {}
  if(daoAddress){
    (async ()=>{
      const contracts = await getContracts(daoAddress, ethers.getDefaultProvider(process.argv[3] || 'rinkeby'))
      for (const c in contracts) console.log(`${c}: ${contracts[c].address}`)
    })()
  } // else console.log("no dao address")
}
