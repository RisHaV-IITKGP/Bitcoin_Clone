
const {BlockChain, Transaction} = require('./blockchain');

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('1436eb95fad80e204c6d0b40359bee5dee4aee257a9ee8ab92a43146d02fd2d1');
const myWalletAddress = myKey.getPublic('hex');

let Bitcoin = new BlockChain;

const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10);
tx1.signTransaction(myKey);
Bitcoin.addTransaction(tx1);

console.log('\n Starting the Miner...');
Bitcoin.minePendingTransactions(myWalletAddress);

console.log('\n Miners Balance is : ' + Bitcoin.getBalanceOfAddress(myWalletAddress));

Bitcoin.minePendingTransactions(myWalletAddress);
console.log('\n Miners Balance is : ' + Bitcoin.getBalanceOfAddress(myWalletAddress));

Bitcoin.chain[1].transactions[0].amount = 1;

console.log('Is chain Valid ? ', Bitcoin.isChainValid());


