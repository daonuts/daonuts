<script>
  import ethers from 'ethers'
  import { account, dao, contribBalance, currencyBalance, currencySymbol } from '../stores'
  import { onMount } from 'svelte'

  let balance

	export let address

  dao.set(address)
</script>

{#await $contribBalance then value}
	<p>{value} CONTRIB</p>
{/await}
{#await Promise.all([$currencyBalance, $currencySymbol]) then value}
	<p>{value[0]} {value[1]}</p>
{/await}
