<script>
  import ethers from 'ethers'
  import { account, dao, contracts, contribBalance, currencyBalance, currencySymbol } from '../stores'
	import Tip from './Tip.svelte'
  const { BigNumber, constants, utils } = ethers

  export let action
  export let actionParams
</script>

{#await $contracts then contracts}
  {#if action == "tip"}
  	<Tip token={contracts.currency} tipping={contracts.tipping} {...actionParams} on:close="{() => action = null}" />
  {/if}
{/await}
