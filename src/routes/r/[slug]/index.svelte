<script context="module">
	import { onMount } from 'svelte'
	import Dao from '../../../components/Dao.svelte'
	import DaoMenu from '../../../components/DaoMenu.svelte'
	import Feed from '../../../components/Feed.svelte'
  import { dao } from '../../../stores'

	export async function preload({ params, query }, session) {
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

	onMount(()=>{
		if(sub.dao){
	  	dao.set(sub.dao)
		}
	})
</script>

<style>
	.title {
		margin-top: 4rem;
	}
	.menu {
		min-height: calc(100vh - 3.25rem);
		margin-top: 0.75rem;
		text-align: center;
		padding-top: 6.25rem;
	}
</style>

<svelte:head>
	<title>{sub.title}</title>
</svelte:head>

<div class="container">
	<div class="columns">
		<aside class="menu section column is-one-fifth">
			<DaoMenu sub={sub} />
		</aside>
		<section class="section column is-four-fifths">
			<h1 class="title has-text-weight-medium">{sub.title}</h1>

			{#if dao}
				<Dao action={action} actionParams={actionParams} />
			{:else}
				<strong><a target='_blank' href='https://www.reddit.com/message/compose/?to=carlslarson&subject={sub.display_name}&message=The {sub.display_name_prefixed} subreddit is interested in a daonuts integration.'}>request integration</a></strong>
			{/if}

			<Feed sub={sub} />
		</section>
	</div>
</div>
