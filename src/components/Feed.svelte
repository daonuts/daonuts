<script>
	import { onMount } from 'svelte'
  import Icon from 'fa-svelte'
  import { faComments } from '@fortawesome/free-solid-svg-icons/faComments'
  import timeSince from '../utils/timeSince'

  let feed = []

  export let sub;

  onMount(async function() {
    const res = await fetch(`r/${sub.slug}/feed.json`);
    feed = await res.json();
  })
</script>

<style>
  ol {
    list-style: none;
  }
  .media {
    align-items: center;
    border-top: 1px solid rgba(0,0,0,0.1);
    padding: 0.75rem 0;
  }
  .score {
    width: 50px;
    text-align: center;
  }
  .thumb {
    width: 70px;
  }
  .thumb img {
    border-radius: 5px;
  }
  .title {
    display: inline;
    margin-right: 0.4rem;
    vertical-align: middle;
  }
  .subtitle {
    margin-top: 0.5rem;
    color: rgba(0,0,0,0.25);
  }
</style>

<ol>
  {#each feed as post}
    <li>
      <article class="media">
        <div class="media-left score">{post.score}</div>
        <a target="_blank" href={`${post.url}`} class="media-left thumb">
          <img src={['self', 'default'].includes(post.thumbnail) ? `logos/${sub.slug}.png` : post.thumbnail} alt={post.title} />
        </a>
        <div class="media-content">
          <div class="content">
            <h2 class="title is-6 has-text-weight-normal">
              <a target="_blank" href={`${post.url}`}>{post.title}</a>
            </h2>
            <span class="subtitle is-size-7">{post.domain}</span>
            <p class="subtitle is-size-7">
              submitted {timeSince(new Date(post.created_utc*1000))} by
              <a target="_blank" href={`https://www.reddit.com/u/${post.author}`}>{`u/${post.author}`}</a>
            </p>
          </div>
          <nav class="level is-mobile">
            <div class="level-left">
              <a target="_blank" href={`https://www.reddit.com${post.permalink}`}>
                <Icon icon={faComments} /> {`${post.num_comments}`}
              </a>
            </div>
          </nav>
        </div>
        <div class="media-right">
          <!-- <button class="delete"></button> -->
        </div>
      </article>
      <!-- {JSON.stringify(post, null, 2)} -->
    </li>
  {/each}
</ol>
