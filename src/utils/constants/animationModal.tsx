// Define the configuration directly without constants
const animationModal = {
  loading: {
    supply: {
      title: 'Processing Deposit Request..',
      content:
        'Your funds will be deposited shortly once the transaction is confirmed.',
    },
    withdraw: {
      title: 'Processing Withdrawal Request...',
      content:
        'Your funds will be transferred to your wallet shortly once the transaction is confirmed.',
    },
    repay: {
      title: 'Processing Repayment...',
      content:
        'Your payment will be applied shortly once the transaction is confirmed.',
    },
    borrow: {
      title: 'Processing Borrowing Request..',
      content:
        'Your loan will be transferred to your wallet shortly once the transaction is confirmed.',
    },
    approve: {
      title: 'Processing Approval Request..',
      content: 'Token will be approved once the transaction is confirmed.',
    },
  },
  completed: {
    supply: {
      title: "It's Complete!",
      content: 'Your deposit has been successfully deposited into HyperLend.',
    },
    withdraw: {
      title: "It's Complete!",
      content:
        'Your withdrawal has been successfully deposited into your wallet.',
    },
    repay: {
      title: "It's Complete!",
      content: 'Your repayment has been successfully processed.',
    },
    borrow: {
      title: "It's Complete!",
      content:
        'Your borrowed amount has been successfully deposited into your wallet.',
    },
    approve: {
      title: "It's Approved!",
      content: 'Token has been approved successfully.',
    },
  },
  failed: {
    supply: {
      title: 'Transaction Failed',
      content:
        "Unfortunately, your borrowing request couldn't be processed. Please try again or contact support if the issue repeats.",
    },
    withdraw: {
      title: 'Transaction Failed',
      content:
        "Unfortunately, your withdrawal request couldn't be processed. Please try again or contact support if the issue repeats.",
    },
    repay: {
      title: 'Transaction Failed',
      content:
        "Unfortunately, your repayment couldn't be processed. Please try again or contact support if the issue repeats.",
    },
    borrow: {
      title: 'Transaction Failed',
      content:
        "Unfortunately, your borrowing request couldn't be processed. Please try again or contact support if the issue repeats.",
    },
    approve: {
      title: 'Transaction Failed',
      content:
        "Unfortunately, your approval transaction couldn't be processed. Please try again or contact support if the issue repeats.",
    },
  },
};

export { animationModal };
