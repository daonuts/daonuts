<script>
	import { stores } from '@sapper/app'
	import { onDestroy, onMount } from 'svelte'
	import Post from './Post.svelte'
	import { filter } from '../stores'

	const { session } = stores()

  let feed = []
	let scores = []
	let votes = []
	let display = []
	let unsubscribeSession, unsubscribeFilter

  export let sub;

  onMount(async function() {
    const feedRes = await fetch(`r/${sub.slug}/feed.json`)
    feed = await feedRes.json()

		unsubscribeSession = session.subscribe(setVotes);
		unsubscribeFilter = filter.subscribe(setDisplay);
  })

	// onDestroy(unsubscribeSession);
	// onDestroy(unsubscribeFilter);


	function findAttr(arr, matchAttr, match, attr){
		let item = arr.find(i=>i[matchAttr]===match)
		return item ? item[attr] : null
	}

	async function setVotes(){
		if($session.user){
			const votesRes = await fetch(`/content/votes.json?contentId=${feed.map(p=>p.name).join(",")}`)
			votes = await votesRes.json()
		}
	}

	async function setDisplay(filter){
		const scoresRes = await fetch(`/content/scores.json?contentId=${feed.map(p=>p.name).join(",")}`)
		scores = await scoresRes.json()
		display = filter ? feed.filter(p=>findAttr(scores, "content_id", p.name, "score")>=0) : feed
	}
</script>

<style>
  ol {
    list-style: none;
  }
	.filter {
		display: flex;
		justify-content: flex-end;
		margin: 0.25rem
	}
</style>

<div class="filter">
	<label class="checkbox">
	  <input type="checkbox" bind:checked={$filter}>
	  Hide downvoted
	</label>
</div>
<ol>
  {#each display as post}
		<li>
			<Post sub={sub} post={post} vote={findAttr(votes, "content_id", post.name, "vote")} score={findAttr(scores, "content_id", post.name, "score")} />
		</li>
  {/each}
</ol>
