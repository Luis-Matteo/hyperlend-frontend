export function claimFaucet(userAddress?: string) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ "type":"ethFaucet", "user": userAddress})
  };

  fetch('https://api.hyperliquid-testnet.xyz/info', requestOptions)
    .then(response => response.json())
    .then(data => {
      alert(data.response)
      console.log(data)
    })
    .catch(error => {
      alert(error)
      console.error(error)
    });
}