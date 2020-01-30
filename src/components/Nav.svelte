<script>
	import { stores } from '@sapper/app'
	import { account, dao, contribBalance, currencyBalance, currencySymbol } from '../stores'

	const { session } = stores()

	export let segment;

	async function login(){
    const res = await fetch(`/login.json?address=${$account}`)
		const _user = await res.json()
		user.set(_user)
		console.log(_user)
	}

	async function logout(){
    const res = await fetch(`/logout`)
		user.set(_user)
		console.log(_user)
	}
</script>

<style>
	nav {
		border-bottom: 1px solid rgba(255,62,0,0.1);
	}

	.navbar-brand {
		font-size: 1.5em;
    font-weight: bold;
	}

	.navbar-brand .navbar-item {
		color: hsl(217, 71%, 53%);
	}

	.navbar-start {
		justify-content: center;
		width: 100%;
	}

	.selected {
		position: relative;
	}

	.selected::after {
		position: absolute;
		content: '';
		width: calc(100% - 1.5em);
		height: 2px;
		background-color: hsl(217, 71%, 53%);
		display: block;
		bottom: -1px;
	}
</style>

<nav class="navbar">
	<div class="container">
		<div class="navbar-brand">
			<a class="navbar-item" href='.'>daonuts</a>
		  <span role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
		    <span aria-hidden="true"></span>
		    <span aria-hidden="true"></span>
		    <span aria-hidden="true"></span>
		  </span>
		</div>
		<div class="navbar-menu">
			<div class="navbar-start">
			</div>
			<div class="navbar-end">
				<a class='navbar-item {segment === undefined ? "selected" : ""}' href='.'>home</a>
				<a class='navbar-item {segment === "about" ? "selected" : ""}' href='about'>about</a>
				<a class='navbar-item' target="_blank" href='https://github.com/daonuts'><span class="icon"><img alt="github" src="/github-brands.svg" /></span></a>
				<a class='navbar-item' target="_blank" href='https://www.reddit.com/r/daonuts'><span class="icon"><img alt="reddit" src="/reddit-brands.svg" /></span></a>
				{#if $account}
					{#if $session && $session.user.username}
					<span on:click={logout} class='navbar-item' title={$session.user.username}>{$session.user.username}</span>
					{:else}
					<span on:click={login} class='navbar-item account'>{`${$account.slice(0,8)}...`}</span>
					{/if}
				{:else}
				<div class='navbar-item'>
					<button class="button is-primary">Connect</button>
				</div>
		  	{/if}
			</div>
		</div>
	</div>
</nav>
