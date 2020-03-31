<script>
  import ethers from 'ethers'
	import { stores } from '@sapper/app'
	import { onDestroy, onMount } from 'svelte'
  import { derived } from 'svelte/store'
  import { account, contracts, contribBalance, currencyBalance, currencySymbol } from '../stores'
	import Tip from './Tip.svelte'
  const { BigNumber, constants, utils } = ethers
  const { session } = stores()

  const balance = derived([contribBalance, currencyBalance], async ([$contribBalance, $currencyBalance]) => {
    if(!$contribBalance || !$currencyBalance) return
    if(!(await $contribBalance) || !(await $currencyBalance)) return
    let contrib = (await $contribBalance).div(constants.WeiPerEther).toNumber()
    let currency = (await $currencyBalance).div(constants.WeiPerEther).toNumber()
    const ratio = contrib / currency

    if(ratio > 0.75) return {ratioClass: "is-success", contrib, currency}
    else if(ratio > 0.5 ) return {ratioClass: "is-warning", contrib, currency}
    else return {ratioClass: "is-danger", contrib, currency}
  })

  async function watchCurrency(){
    if(!window.ethereum) return;
    let contracts = await $contracts
    console.log(contracts.currency.address)
    ethereum.sendAsync({
        method: 'wallet_watchAsset',
        params: {
          "type":"ERC20",
          "options":{
            "address": contracts.currency.address,
            "symbol": await $currencySymbol,
            "decimals": 18,
            "image": `https://daonuts.org/currency_icons/${sub.display_name}.svg`,
          },
        },
        id: Math.round(Math.random() * 100000)
    }, (err, added) => (added && console.log('Token added')))
  }

	async function setBalance(){
    const balanceRes = await fetch(`r/${sub.display_name.toLowerCase()}/credits.json`)
    burnBalance = (await balanceRes.json()).balance
		console.log(burnBalance)
	}

  onMount(async function() {
		unsubSession = session.subscribe(setBalance)
  })

  export let sub
  let burnBalance = 0
</script>

<style>
  .staking,
  .auth.button {
    margin-top: 1.5rem;
  }
  .staking > p {
    margin-bottom: 0.5rem;
  }
</style>

{#await Promise.all([$balance, $currencySymbol]) then value}
	<p>{value[0].currency} {value[1]}</p>
  <progress class="progress {value[0].ratioClass}" title={`${value[0].currency} of ${value[0].contrib} earned`} value={value[0].currency} max={value[0].contrib}>{value[0].currency}</progress>
{/await}
<a target="_blank" href={`https://mainnet.aragon.org/#/${sub.ens || sub.dao}/`}>DAO Admin</a>

{#if $session.user}
<div class="staking">
  <p>Staking balance: {burnBalance}</p>
  <a class="button" href={`/r/${sub.slug}/?action=credit`}>
    Add credit
  </a>
</div>
{/if}

{#if $session.user && !$session.user.redditAccess}
<a class="auth button" href={'/auth'}>
  vote on Reddit
</a>
{/if}
