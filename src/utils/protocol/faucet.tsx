export function claimFaucet(userAddress?: string) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'ethFaucet', user: userAddress }),
  };

  fetch('https://api.hyperliquid-testnet.xyz/info', requestOptions)
    .then((response) => response.json())
    .then((data) => {
      if (data.status == 'ok') {
        alert('ETH claimed');
      } else if (data.status == 'err') {
        fetch('https://api.hyperlend.finance/ethFaucet', requestOptions)
          .then((res) => res.json())
          .then((d) => {
            if (d.status == 'ok') {
              alert('ETH claimed');
            } else if (d.status == 'err') {
              if (d.response == "user_already_claimed_eth"){
                alert("User can only claim faucet once per wallet!")
              } else {
                alert(d.response);
              }
            }
          })
          .catch((err) => {
            alert(err);
            console.error(err);
          });
      }
    })
    .catch((error) => {
      alert(error);
      console.error(error);
    });
}
