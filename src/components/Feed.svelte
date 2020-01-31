<script>
	import { onMount } from 'svelte'
	import Post from './Post.svelte'

  let feed = []
	let scores = []
	let votes = []

  export let sub;

  onMount(async function() {
    const feedRes = await fetch(`r/${sub.slug}/feed.json`);
    feed = await feedRes.json();
		console.log(feed)

	  const scoresRes = await fetch(`/content/scores.json?contentId=${feed.map(p=>p.name).join(",")}`)
	  scores = await scoresRes.json()
	  console.log(scores)

	  const votesRes = await fetch(`/content/votes.json?contentId=${feed.map(p=>p.name).join(",")}`)
	  votes = await votesRes.json()
	  console.log(votes)
  })

	function findAttr(arr, matchAttr, match, attr){
		let item = arr.find(i=>i[matchAttr]===match)
		return item ? item[attr] : null
	}
</script>

<style>
  ol {
    list-style: none;
  }
</style>

<ol>
  {#each feed as post}
		<li>
			<Post sub={sub} post={post} vote={findAttr(votes, "content_id", post.name, "vote")} score={findAttr(scores, "content_id", post.name, "score")} />
		</li>
  {/each}
</ol>
