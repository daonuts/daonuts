<script>
	import { onMount } from 'svelte'
	import Post from './Post.svelte'

  let feed = []

  export let sub;

  onMount(async function() {
    const res = await fetch(`r/${sub.slug}/feed.json`);
    feed = await res.json();
		console.log(feed)
  })
</script>

<style>
  ol {
    list-style: none;
  }
</style>

<ol>
  {#each feed as post}
		<li>
			<Post sub={sub} post={post} />
		</li>
  {/each}
</ol>
