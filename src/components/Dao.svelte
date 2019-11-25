<script>
  import ethers from 'ethers'
  import { account, dao, contracts, contribBalance, currencyBalance, currencySymbol } from '../stores'
	import Tip from './Tip.svelte'
  const { BigNumber, constants, utils } = ethers

  let balance

	export let address
  export let action
  export let actionParams

  dao.set(address)
</script>

{#await $contribBalance then value}
	<p>{value.div(constants.WeiPerEther)} CONTRIB</p>
{/await}
{#await Promise.all([$currencyBalance, $currencySymbol]) then value}
	<p>{value[0].div(constants.WeiPerEther)} {value[1]}</p>
{/await}

{#await $contracts then contracts}
  {#if action == "tip"}
  	<Tip token={contracts.currency} tipping={contracts.tipping} {...actionParams} on:close="{() => action = null}" />
  {/if}
{/await}
