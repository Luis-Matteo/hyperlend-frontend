export async function claimFaucet(userAddress?: string) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'ethFaucet', user: userAddress }),
  };

  return new Promise<void>((resolve) => {
    fetch('https://api.hyperliquid-testnet.xyz/info', requestOptions)
    .then((response) => response.json())
    .then((data) => {
      if (data.status == 'ok') {
        alert('ETH claimed');
        resolve();
      } else if (data.status == 'err') {
        fetch('https://api.hyperlend.finance/ethFaucet', requestOptions)
          .then((res) => res.json())
          .then((d) => {
            if (d.status == 'ok') {
              alert('ETH claimed');
              resolve();
            } else if (d.status == 'err') {
              if (d.response == 'user_already_claimed_eth') {
                alert('User can only claim faucet once per wallet!');
                resolve();
              } else {
                alert(d.response);
                resolve();
              }
            }
          })
          .catch((err) => {
            alert(err);
            console.error(err);
            resolve();
          });
      }
    })
    .catch((error) => {
      alert(error);
      console.error(error);
      resolve();
    });
  })
}