<script>
	import { account, dao, contribBalance, currencyBalance, currencySymbol } from '../stores'
	export let segment;
</script>

<style>
	nav {
		border-bottom: 1px solid rgba(255,62,0,0.1);
		/* font-weight: 300;
		padding: 0 1em;
		display: flex;
    justify-content: space-between; */
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
				<span class='navbar-item account'>{$account && `${$account.slice(0,8)}...`}</span>
			</div>
		</div>
	</div>
</nav>
