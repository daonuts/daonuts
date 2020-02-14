<script>
	import { stores } from '@sapper/app'
	import { onDestroy, onMount } from 'svelte'
	import Post from './Post.svelte'
	import { feedType } from '../stores'

	const { session } = stores()

  let feed = []
	let scores = []
	let votes = []
	let display = []
	let called
	let unsubSession, unsubFeedType, unsubFilter

  export let sub;

  onMount(async function() {
		unsubFeedType = feedType.subscribe(setFeed)
		unsubSession = session.subscribe(setVotes)
  })

	// onDestroy(unsubSession);
	// onDestroy(unsubFilter);


	function findAttr(arr, matchAttr, match, attr){
		let item = arr.find(i=>i[matchAttr]===match)
		return item ? item[attr] : null
	}

	async function loadMore(){
		if(!called){
			called = true
			const moreRes = await fetch(`r/${sub.slug}/feed.json?type=${$feedType}&after=${feed[feed.length-1].name}`)
			const more = await moreRes.json()

			feed = feed.concat(more)
			setTimeout(()=>called=false,0)
		}
	}

	async function setFeed(newFeedType){
		console.log(newFeedType)
    const feedRes = await fetch(`r/${sub.slug}/feed.json?type=${newFeedType}`)
    feed = await feedRes.json()

		console.log(feed)
		await setVotes()
	}

	async function setVotes(){
		if($session.user && feed.length){
			const votesRes = await fetch(`/content/votes.json?contentId=${feed.map(p=>p.name).join(",")}`)
			votes = await votesRes.json()
		}
	}

	async function scrolled(e){
		if(window.innerHeight + window.scrollY > document.documentElement.scrollHeight - 1000)
			loadMore()
	}

</script>

<style>
  ol {
    list-style: none;
  }
</style>

<svelte:window on:scroll={scrolled}/>

{#if $session.user && !$session.user.redditAccess}
<a href={'/auth'}>auth reddit voting</a>
{/if}
<div class="tabs">
  <ul>
    <li class:is-active="{$feedType === 'member'}"><a href="javascript:" on:click="{()=>feedType.set('member')}">Member</a></li>
    <li class:is-active="{$feedType === 'hot'}"><a href="javascript:" on:click="{()=>feedType.set('hot')}">Hot</a></li>
    <li class:is-active="{$feedType === 'new'}"><a href="javascript:" on:click="{()=>feedType.set('new')}">New</a></li>
  </ul>
</div>
<ol>
  {#each feed as post}
		<li>
			<Post sub={sub} post={post} vote={findAttr(votes, "content_id", post.name, "vote")} score={post.member_score} />
		</li>
  {/each}
</ol>
