<script>
  import ethers from 'ethers'
  import { derived } from 'svelte/store'
  import { account, contracts, contribBalance, currencyBalance, currencySymbol } from '../stores'
	import Tip from './Tip.svelte'
  const { BigNumber, constants, utils } = ethers

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

  export let sub
</script>

<img src={`logos/${sub.display_name}.png`} />
{#await Promise.all([$balance, $currencySymbol]) then value}
	<p>{value[0].currency} {value[1]}</p>
  <progress class="progress {value[0].ratioClass}" value={value[0].currency} max={value[0].contrib}>{value[0].currency}</progress>
{/await}
