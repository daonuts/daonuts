<script>
  import { createEventDispatcher, onDestroy } from 'svelte';
  import ethers from 'ethers'
  const { BigNumber, constants, utils } = ethers
  const { Fragment, Interface, formatBytes32String, parseBytes32String, toUtf8Bytes, hexlify, hexZeroPad, bigNumberify } = utils
  import { burnCreditsChange } from '../stores'

	let counter = 0
	const unsubscribe = burnCreditsChange.subscribe(v => counter = v || 0);

  let frag = Fragment.from({
      "name": "daonutsCreditV1",
      "type": "function"
  })
  let iface = new Interface([frag])

  const dispatch = createEventDispatcher();
  const close = () => dispatch('close');
  const handleKeydown = e => {
		if (e.key === 'Escape') {
			close();
			return;
		}
	};

  let value = 5000
  let symbol

	export let token
  export let address

  (async ()=>{
    symbol = await token.symbol()
  })()

  async function submit(e){
    e.preventDefault()
    let val = BigNumber.from(value).mul(constants.WeiPerEther)
    const data = iface.encodeFunctionData(frag, [])
    console.log(data)
    await ethereum.enable()
    token = token.connect(token.provider.getSigner())
    let creditTx = await token.send(address, val, data)
    await creditTx.wait()
    close()
    setTimeout(()=>{
      burnCreditsChange.set(counter+1)
    }, 2000)
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
      <h2 class="subtitle">Burn <span class="input" contenteditable="true" bind:innerHTML={value}>{value}</span> {symbol} to add credit</h2>

      <button class="button is-primary">Burn to credit</button>
    </form>
  </div>
  <button class="modal-close is-large" on:click={close} aria-label="close"></button>
</div>
