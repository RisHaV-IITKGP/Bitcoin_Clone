/******************************

#   Import the SHA256 package.

#   This package includes our Hashing function 
    which will be used in creating Hashes for the 
    Blocks in our BlockChain.

#   To install this package use "npm install --save crypto-js"

******************************/
const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');



class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(signingKey) {
        if(signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error('You cannot sign transactions for other wallets !');
        }

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }

    isValid() {
        if(this.fromAddress === null) return true;

        if(!this.signature || this.signature.length === 0) {
            throw new Error('No signature in this transaction');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}



/******************************

#   A Class of Blocks 

#   Member Functions : 

        #   constructor()         : Constructor to initialize data members.

        #   calculateHash()       : Calculates Hash of the Current Block using SHA256 library.

        #   mineBlock(difficulty) : Mines the Block based on the difficulty level
                                    More the difficulty , more will be the time taken to
                                    mine the Block.

******************************/
class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block Mined : " + this.hash);
    }

    hasValidTransactions() {
        for(const tx of this.transactions) {
            if(!tx.isValid()) {
                return false;
            }
        }

        return true;
    }
}



/******************************

#   A Class of Representing the BlockChain Structure

#   Contains an Array of Blocks and the difficulty level of mining each Block.

#   Member Functions : 

        #   constructor()         : Constructor to initialize data members.

        #   createGenesisBlock()  : Creates the first Block of the BlockChain , 
                                    the Genesis Block .

        #   getLatestBlock()      : Returns the last added Block in the BlockChain.

        #   addBlock(newBlock)    : Mines a new Block and adds it to the BlockChain.

        #   isChainValid()        : Checks the Validity of the Current BlockChain.

******************************/
class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block("03/02/2021", "GenesisBlock", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block Successfully Mined !');

        const previousBlock = this.getLatestBlock();
        block.previousHash = previousBlock.hash;
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }


    addTransaction(transaction) {

        if(!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Transaction musr include from and to Address');
        }

        if(!transaction.isValid()) {
            throw new Error('Cannot Add invalid transaction to chain');
        }
        
        this.pendingTransactions.push(transaction);
    }


    getBalanceOfAddress(address) {
        let balance = 0;

        for(const block of this.chain) {
            for(const trans of block.transactions) {
                if(trans.fromAddress === address) {
                    balance -= trans.amount;
                }

                if(trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid() {
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(!currentBlock.hasValidTransactions()) {
                return false;
            }

            if(currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            
            if(currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }

            return true;
        }
    }


}

module.exports.BlockChain = BlockChain;
module.exports.Transaction = Transaction;