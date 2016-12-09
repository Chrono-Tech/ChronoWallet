module.exports = {
    contractAddresses: ['0x44815af1a9deac7f2152a81de4143ef070440fd2','0x0326ac5b3659aa5aecde5808931a59a6d8f6f51f', '0x99f7c94e7d2ef4ff5efc66d56522a8b7e4284501'],
    fiat: ['EUR', 'AUD', 'USD'], //fiat should be written in same order as contract according to it's currency!!!!,
    fee: [0.0015, 0.0015, 0.0015], //fee should be written in same order as contract accordingly!!!!,
    fiatRate: [0.1, 15, 2], //fiat rate should be written in same order as contract accordingly!!!!,
    contractABI: [{
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [{"name": "", "type": "string"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_from", "type": "address"}, {
            "name": "_spender",
            "type": "address"
        }, {"name": "_value", "type": "uint256"}],
        "name": "emitApprove",
        "outputs": [],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_from", "type": "address"}, {
            "name": "_to",
            "type": "address"
        }, {"name": "_value", "type": "uint256"}],
        "name": "transferFrom",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_from", "type": "address"}, {
            "name": "_to",
            "type": "address"
        }, {"name": "_value", "type": "uint256"}],
        "name": "emitTransfer",
        "outputs": [],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [],
        "name": "claimContractOwnership",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "chronoBankPlatform",
        "outputs": [{"name": "", "type": "address"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_to", "type": "address"}],
        "name": "changeContractOwnership",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "pendingContractOwner",
        "outputs": [{"name": "", "type": "address"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_from", "type": "address"}, {
            "name": "_to",
            "type": "address"
        }, {"name": "_value", "type": "uint256"}, {"name": "_reference", "type": "string"}],
        "name": "transferFromWithReference",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_to", "type": "address"}, {
            "name": "_value",
            "type": "uint256"
        }, {"name": "_data", "type": "bytes"}],
        "name": "forwardCall",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [{"name": "", "type": "bytes32"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}],
        "name": "transfer",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_to", "type": "address"}, {
            "name": "_value",
            "type": "uint256"
        }, {"name": "_reference", "type": "string"}],
        "name": "transferWithReference",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "contractOwner",
        "outputs": [{"name": "", "type": "address"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_chronoBankPlatform", "type": "address"}, {
            "name": "_symbol",
            "type": "bytes32"
        }, {"name": "_name", "type": "string"}],
        "name": "init",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": true, "name": "from", "type": "address"}, {
            "indexed": true,
            "name": "to",
            "type": "address"
        }, {"indexed": false, "name": "value", "type": "uint256"}],
        "name": "Transfer",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": true, "name": "from", "type": "address"}, {
            "indexed": true,
            "name": "spender",
            "type": "address"
        }, {"indexed": false, "name": "value", "type": "uint256"}],
        "name": "Approve",
        "type": "event"
    }]
};