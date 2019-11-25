<script>
  import ethers from 'ethers'
  const { BigNumber, utils } = ethers
  const { formatBytes32String, parseBytes32String, toUtf8Bytes, hexlify, hexZeroPad, bigNumberify } = utils

  const decimals = "1000000000000000000"

  let value = 1000

	export let token
	export let tipping
  export let recipient
  export let address
  export let contentId

  async function submit(){
    let val = BigNumber.from(value).mul(decimals);
    let id = formatBytes32String(contentId)
    const data = "0x" + [hexlify(1) /*1 = tip*/, address, id].map(a=>a.substr(2)).join("")
    console.log(data)
    await ethereum.enable()
    token = token.connect(token.provider.getSigner())
    await token.send(tipping.address, val, data)
  }

</script>

<p>{recipient}</p>
<p>{address}</p>
<p>{contentId}</p>
<input type="number" bind:value>
<button on:click={submit}>Tip</button>
