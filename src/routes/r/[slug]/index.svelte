<script context="module">
	import { stores } from '@sapper/app'
	import { onMount } from 'svelte'
	import Dao from '../../../components/Dao.svelte'
	import DaoMenu from '../../../components/DaoMenu.svelte'
	import Feed from '../../../components/Feed.svelte'
  import { account, dao } from '../../../stores'

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
	const { session } = stores()

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
		margin-top: 10rem;
	}
	.menu {
		min-height: calc(100vh - 3.25rem);
		margin-top: 0.75rem;
		text-align: center;
		padding-top: 6.25rem;
	}
	#request-dao.button {
		white-space: normal;
		height: auto;
	}
	.hero-body {
		padding-bottom: 0;
	}
</style>

<svelte:head>
	<title>{sub.title}</title>
</svelte:head>

<section class="hero" style="background: top center no-repeat url({sub.banner_background_image})">
  <div class="hero-body">
    <div class="container">
			<h1 class="title has-text-weight-medium is-size-4">{sub.title}</h1>
    </div>
  </div>
</section>

<div class="container">
	<div class="columns">
		<aside class="menu section column is-one-fifth">
			<img alt={`${sub.display_name} logo`} src={sub.icon_img} class="logo" />
			{#if $dao}
				<DaoMenu sub={sub} />
			{:else}
				<a id="request-dao" class="button is-primary" target='_blank' href='https://www.reddit.com/message/compose/?to=carlslarson&subject={sub.display_name}&message=The {sub.display_name_prefixed} subreddit is interested in a daonuts integration.'}>Request dao integration</a>
			{/if}
		</aside>
		<section class="section column is-four-fifths">
			{#if $dao}
				<Dao action={action} actionParams={actionParams} />
			{/if}

			<Feed sub={sub} />
		</section>
	</div>
</div>
