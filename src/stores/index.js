import ethers from 'ethers'
import { writable, derived } from 'svelte/store'
import getContracts from '../utils/getContracts'

export const account = writable()
export const provider = derived(account, $account => {
  if($account) return new ethers.providers.Web3Provider(web3.currentProvider, 'mainnet')
  else return ethers.getDefaultProvider('mainnet')
})
export const accountUser = derived(account, async $account => {
  if(!$account) return null
  let res = await fetch(`/users.json?address=${await $account}`)
  if(res.status !== 200) return null
  else return (await res.json())[0]
})
export const dao = writable()

export const burnCreditsChange = writable()
export const burnCredits = derived([account, dao, burnCreditsChange], async ([$account, $dao]) => {
  if(!$account || !$dao) return null
  const creditsRes = await fetch(`r/${$dao.slug.toLowerCase()}/credits.json?address=${await $account}`)
  if(creditsRes.status !== 200) return null
  else return (await creditsRes.json()).balance
})
export const contracts = derived([dao, provider], async ([$dao, $provider]) => {
  if(!$dao || !$provider) return null
  return await getContracts($dao.address, $provider)
})
export const contribBalance = derived([account, contracts], async ([$account, $contracts]) => {
  if(!$account || !$contracts) return null
  const contracts = await $contracts
  if(!contracts) return null
  const { contrib } = contracts
  return await contrib.balanceOf($account)
})
export const currencyBalance = derived([account, contracts], async ([$account, $contracts]) => {
  if(!$account || !$contracts) return null
  const contracts = await $contracts
  if(!contracts) return null
  const { currency } = contracts
  return await currency.balanceOf($account)
})
export const currencySymbol = derived(contracts, async ($contracts) => {
  if(!await $contracts) return null
  const { currency } = await $contracts
  return await currency.symbol()
})
export const feedType = writable('member')
// export const filter = writable(true)

async function init(){
  if(typeof ethereum !== 'undefined'){
    let res = await ethereum.enable()
    res.length && account.set(res[0])
  }
}
init()
