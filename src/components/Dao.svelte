<script>
  import ethers from 'ethers'
  import { account, dao, contracts, contribBalance, currencyBalance, currencySymbol } from '../stores'
	import Tip from './Tip.svelte'
	import Credit from './Credit.svelte'
  const { BigNumber, constants, utils } = ethers

  export let action
  export let actionParams
</script>

{#await $contracts then contracts}
  {#if action == "tip"}
  	<Tip token={contracts.currency} {...actionParams} on:close="{() => action = null}" />
  {:else if action == "credit" }
  	<Credit token={contracts.currency} address={contracts.burn.address} on:close="{() => action = null}" />
  {/if}
{/await}
