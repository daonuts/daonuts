<script>
  import { createEventDispatcher, onDestroy } from 'svelte';
  import ethers from 'ethers'
  const { BigNumber, constants, utils } = ethers
  const { formatBytes32String, parseBytes32String, toUtf8Bytes, hexlify, hexZeroPad, bigNumberify } = utils

  const dispatch = createEventDispatcher();
  const close = () => dispatch('close');
  const handleKeydown = e => {
		if (e.key === 'Escape') {
			close();
			return;
		}
	};

  let value = 1000
  let symbol

	export let token
	export let tipping
  export let recipient
  export let address
  export let contentId

  (async ()=>{
    symbol = await token.symbol()
  })()

  async function submit(e){
    e.preventDefault()
    let val = BigNumber.from(value).mul(constants.WeiPerEther)
    let id = formatBytes32String(contentId)
    const data = "0x" + [hexlify(1) /*1 = tip*/, hexZeroPad(hexlify(address),32), id].map(a=>a.substr(2)).join("")
    console.log(data)
    await ethereum.enable()
    token = token.connect(token.provider.getSigner())
    let tipTx = await token.send(tipping.address, val, data)
    await tipTx.wait()
    close()
  }

</script>

<style>
	.modal-content {
    background: rgba(255,255,255);
    padding: 2rem;
	}
  [contenteditable].input {
    width: auto;
    vertical-align: middle;
    margin-top: -3px;
    font-size: 1.25rem;
  }
  form .button {
    float: right;
  }
</style>

<svelte:window on:keydown={handleKeydown}/>

<div class="modal is-active">
  <div class="modal-background"></div>
  <div class="modal-content">
    <form on:submit={submit}>
      <h2 class="subtitle">Tip <span class="input" contenteditable="true" bind:innerHTML={value}>{value}</span> {symbol} to <a href={`https://etherscan.io/address/${address}`}>{recipient}</a> for {contentId}</h2>

      <button class="button is-primary">Tip</button>
    </form>
  </div>
  <button class="modal-close is-large" on:click={close} aria-label="close"></button>
</div>
