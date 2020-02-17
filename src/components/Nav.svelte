<script>
	import { stores } from '@sapper/app'
	import { account, dao, contribBalance, currencyBalance, currencySymbol, accountUser, provider } from '../stores'

	const { session } = stores()

	let hideAddressWarning = false;
	export let segment;

	async function login(){
		const name = (await $accountUser).username
		const sig = await $provider.getSigner($account).signMessage(`Login ${name} ${$session.nonce}`)
    const res = await fetch(`/login.json?address=${$account}&sig=${sig}`)
		const data = await res.json()
		if (!res.ok)
      throw new Error(data.message);
    else
			session.set({...$session, user: data})
	}

	async function logout(){
    const res = await fetch(`/logout`)
		session.set({...$session, user: null})
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
	.notification {
		margin-bottom: 0;
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
					{#if $session.user}
					<span class='navbar-item'><button on:click={logout} class="button is-primary">Sign Out {$session.user.username}</button></span>
					{:else}
						{#await $accountUser then accountUser}
							{#if accountUser}
								<span class='navbar-item'><button on:click={login} class="button is-primary">Sign In</button></span>
							{:else}
								<span class='navbar-item account'>Unregistered ({`${$account.slice(0,8)}...`})</span>
							{/if}
						{/await}
					{/if}
		  	{/if}
			</div>
		</div>
	</div>
</nav>
{#if $session.user && $account && $account !== $session.user.address && !hideAddressWarning}
	<div class="notification is-warning">
		<button class="delete" on:click={()=>hideAddressWarning=true}></button>
	  Your current Ethereum address ({$account}) does not match your registered address ({$session.user.address}). On-chain interactions may not have the intended results.
	</div>
{/if}
