
/******************************

#   Import the SHA256 package.

#   This package includes our Hashing function 
    which will be used in creating Hashes for the 
    Blocks in our BlockChain.

#   To install this package use "npm install --save crypto-js"

******************************/
const SHA256 = require('crypto-js/sha256');





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
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
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
        this.difficulty = 5;
    }

    createGenesisBlock() {
        return new Block(0, "03/02/2021", "GenesisBlock", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

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

let Bitcoin = new BlockChain;

console.log('Mining Block 1....')
Bitcoin.addBlock(new Block(1, "03/02/2021", { amount : 10}));

console.log('Mining Block 2....')
Bitcoin.addBlock(new Block(2, "03/02/2021", { amount : 4}));

//console.log('Is BlockChain Valid ? ' + Bitcoin.isChainValid());

//console.log(JSON.stringify(Bitcoin, null, 4));
