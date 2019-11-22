<script context="module">
	import Dao from '../../../components/Dao.svelte'
	export async function preload({ params, query }) {

		console.log(params, query)
		// the `slug` parameter is available because
		// this file is called [slug].svelte
		const res = await this.fetch(`r/${params.slug}.json`);
		const sub = await res.json();
		const { action, ...actionParams } = query;

		if (res.status === 200) {
			return { sub, action, actionParams };
		} else {
			this.error(res.status, data.message);
		}
	}
</script>

<script>
	export let sub;
	export let action;
	export let actionParams;
</script>

<style>
	.title {
		margin-top: 4rem;
	}
</style>

<svelte:head>
	<title>{sub.title}</title>
</svelte:head>

<div class="container">

	<h1 class="title">{sub.title}</h1>
	{sub.public_description}

	{#if sub.dao}
		<p>has integration ({sub.dao})</p>
		<Dao address={sub.dao} action={action} actionParams={actionParams} />
	{:else}
		<strong><a target='_blank' href='https://www.reddit.com/message/compose/?to=carlslarson&subject={sub.display_name}&message=The {sub.display_name_prefixed} subreddit is interested in a daonuts integration.'}>request integration</a></strong>
	{/if}
</div>
