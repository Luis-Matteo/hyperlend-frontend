// import { getBlock } from '@wagmi/core';
// import { config } from '../../provider/AppKitProvider';

export async function claimFaucet(token: any, userAddress?: string) {
  // const blockData = await getBlock(config);
  // let { hash, number } = blockData;

  // const powChallenge = `${hash}-${number}-${userAddress}`;
  // const difficulty = 1;

  // let powResult: string = '';
  // let nonce: number = 0;
  // while (
  //   powResult.substring(0, difficulty) !== Array(difficulty + 1).join('0')
  // ) {
  //   nonce++;
  //   powResult = (await sha256(powChallenge + nonce)).toString();
  // }

  // const challengeResult = `${userAddress}:${number}:${nonce}`;
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'ethFaucet',
      user: userAddress,
      challenge: token,
    }),
  };

  return new Promise<void>((resolve) => {
    fetch('https://api.hyperliquid-testnet.xyz/info', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 'ok') {
          alert('Native tokens claimed');
          resolve();
        } else if (data.status == 'err') {
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
  });
}

// async function sha256(message: any) {
//   const msgBuffer = new TextEncoder().encode(message);
//   const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
//   const hashArray = Array.from(new Uint8Array(hashBuffer));
//   const hashHex = hashArray
//     .map((b) => b.toString(16).padStart(2, '0'))
//     .join('');
//   return hashHex;
// }
