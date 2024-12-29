export async function claimFaucet(token: any, userAddress?: string) {
  try {
    const challengeV2Text =
    'If you are running the farming bot, stop wasting your time. Testnet will not be directly incentivized, and mainnet airdrop will be linear with a minimum threshold.';
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'ethFaucet',
      user: userAddress,
      challenge: token,
      challengeV2: challengeV2Text,
    }),
  };

  return new Promise<void>((resolve) => {
    fetch('https://api.hyperlend.finance/ethFaucet', requestOptions)
      .then((res) => res.json())
      .then((d) => {
        if (d.status == 'ok') {
          alert('Native token claimed');
          resolve();
        } else if (d.status == 'err') {
          if (d.response == 'user_already_claimed') {
            alert('User can only claim faucet once per wallet!');
            resolve();
          } else {
            alert(d.response);
            resolve();
          }
        }
      })
      .catch((err) => {
        alert(`Error claiming faucet: ${err.message}`);
        console.error(err);
        resolve();
      });
  });
  } catch (e: any){
    alert(`Error claiming faucet in claimFaucet(): ${e.message}`);
    console.log(`Error in claimFaucet: ${e.message}`)
  }
}
