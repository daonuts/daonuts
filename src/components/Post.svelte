<script>
	import { stores } from '@sapper/app'
  import Icon from 'fa-svelte'
  import { faComments } from '@fortawesome/free-solid-svg-icons/faComments'
  import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp'
  import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown'
  import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
  import timeSince from '../utils/timeSince'

	const { session } = stores()

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
    console.log(s)
    vote = s.vote
    score = s.score
  }

	async function doStake(){
		const res = await fetch("/content/stakes.json", {
			method: 'POST',
			body: JSON.stringify({contentId: post.name}),
			headers: {
				'Content-Type': 'application/json'
			}
		})

    const s = await res.json()
    console.log(s)
	}
</script>

<style>
  .media {
    align-items: center;
    border-bottom: 1px solid rgba(0,0,0,0.1);
    padding: 0.75rem 0;
  }
  .score {
    width: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: default;
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
  .vote {
    display: flex;
    cursor: pointer;
    color: rgba(0,0,0,0.4);
  }
  .vote.disabled {
    cursor: default;
    color: rgba(0,0,0,0.1);
  }
  .thumb {
    display: flex;
    width: 70px;
  }
  .thumb img {
    border-radius: 5px;
  }
  .title {
    display: inline;
    margin-right: 0.4rem;
    /* vertical-align: middle; */
  }
  .subtitle {
    margin-top: 0.5rem;
  }
  .diminish {
    color: rgba(0,0,0,0.25);
  }
	.member {
		color: goldenrod;
	}
	.stake {
		cursor: pointer;
		color: rgba(0,0,0,0.1);
	}
	.stake:hover {
		color: rgba(0,0,0,0.4);
	}
	.staked .stake {
		cursor: default;
		color: gold;
	}
	.staked .stake:hover {
		color: inherit;
	}
</style>

<article class="media" class:staked={!!post.daonuts_staker}>
  {#if $session.user}
  <div class="media-left score">
    <div class="vote up" class:has-text-success={vote === 1} on:click={()=>doVote(vote === 1 ? 0 : 1)}><Icon icon={faChevronUp} /></div>
    <div class="value">
      <span class="">{score || 0}</span>
      <span class="diminish is-size-7">{post.score}</span>
    </div>
    <div class="vote down" class:has-text-danger={vote === -1} on:click={()=>doVote(vote === -1 ? 0 : -1)}><Icon icon={faChevronDown} /></div>
  </div>
  {:else}
  <div class="media-left score" data-tooltip="Sign In to vote">
    <div class="vote up disabled"><Icon icon={faChevronUp} /></div>
    <div class="value">
      <span class="">{score || 0}</span>
      <span class="diminish is-size-7">{post.score}</span>
    </div>
    <div class="vote down disabled"><Icon icon={faChevronDown} /></div>
  </div>
  {/if}
  <a target="_blank" href={`${post.url}`} class="media-left thumb"><!-- `logos/${sub.display_name.toLowerCase()}.png` -->
    <img src={['self', 'default'].includes(post.thumbnail) ? sub.icon_img : post.thumbnail} alt={post.title} />
  </a>
  <div class="media-content">
    <div class="content">
      <h2 class="title is-6 has-text-weight-normal">
        <a target="_blank" href={`${post.url}`}>{post.title}</a>
      </h2>
      <span class="diminish is-size-7">{post.domain}</span>
      <p class="subtitle is-size-7">
        submitted {timeSince(new Date(post.created_utc*1000))} by
        <a class:member={!!post.daonuts_address} target="_blank" href={`https://www.reddit.com/u/${post.author}`}>{`u/${post.author}`}</a>
				<!-- {#if post.daonuts_address}
					<button class="button is-light is-info is-small">tip</button>
				{/if} -->
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
	  {#if post.daonuts_staker}
			<div class="stake" title={post.daonuts_staker}><Icon icon={faCheck} /></div>
	  {:else}
			<div class="stake" on:click={doStake}><Icon icon={faCheck} /></div>
	  {/if}
  </div>
</article>
