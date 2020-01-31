<script>
  import Icon from 'fa-svelte'
  import { faComments } from '@fortawesome/free-solid-svg-icons/faComments'
  import timeSince from '../utils/timeSince'

  export let sub
  export let post
  export let vote
  export let score

  async function doVote(dir){
    console.log(dir)
    const res = await fetch("/content/votes.json", {
      method: 'POST',
      body: JSON.stringify({contentId: post.name, vote: dir}),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const s = await res.json()
    vote = s.vote
    score = s.score
  }
</script>

<style>
  .media {
    align-items: center;
    border-top: 1px solid rgba(0,0,0,0.1);
    padding: 0.75rem 0;
  }
  .score {
    width: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .score > .value {
    position: relative;
    flex-grow: 1;
  }
  .score > .value > .diminish {
    position: absolute;
    top: 0.25rem;
    margin-left: 0.25rem;
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
  }
  .diminish {
    color: rgba(0,0,0,0.25);
  }
  .vote.active {
    color: blue;
  }
</style>

<article class="media">
  <div class="media-left score">
    <div class="vote up" class:active={vote === 1} on:click={()=>doVote(vote === 1 ? 0 : 1)}>up</div>
    <div class="value">
      <span class="">{score || 0}</span>
      <span class="diminish is-size-7">{post.score}</span>
    </div>
    <div class="vote down" class:active={vote === -1} on:click={()=>doVote(vote === -1 ? 0 : -1)}>down</div>
  </div>
  <a target="_blank" href={`${post.url}`} class="media-left thumb">
    <img src={['self', 'default'].includes(post.thumbnail) ? `logos/${sub.slug}.png` : post.thumbnail} alt={post.title} />
  </a>
  <div class="media-content">
    <div class="content">
      <h2 class="title is-6 has-text-weight-normal">
        <a target="_blank" href={`${post.url}`}>{post.title}</a>
      </h2>
      <span class="diminish is-size-7">{post.domain}</span>
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
