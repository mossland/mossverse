/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { AkaMarket, AkaMarketInterface } from "../../contracts/AkaMarket";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "OPERATOR_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "operators",
        type: "address[]",
      },
    ],
    name: "addOperators",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "operators",
        type: "address[]",
      },
    ],
    name: "removeOperators",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "erc20Limit",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "erc721Limit",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "erc1155Limit",
        type: "uint256",
      },
    ],
    name: "setLimits",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "contractAddr",
        type: "address",
      },
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "transferErc1155",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "contractAddr",
        type: "address",
      },
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferErc20",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "contractAddr",
        type: "address",
      },
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferErc721",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405260006002556000600355600060045534801561001f57600080fd5b5061003c61003161004160201b60201c565b61004960201b60201c565b61010d565b600033905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b61206b806200011d6000396000f3fe608060405234801561001057600080fd5b50600436106101165760003560e01c8063715018a6116100a2578063a217fddf11610071578063a217fddf146102a1578063d365a377146102bf578063d547741f146102db578063f2fde38b146102f7578063f5b541a61461031357610116565b8063715018a61461022d5780638da5cb5b1461023757806391d1485414610255578063a07aea1c1461028557610116565b80631d8a099a116100e95780631d8a099a1461019f578063248a9ca3146101bb5780632f2ff15d146101eb57806336568abe146102075780633ccfd60b1461022357610116565b806301ffc9a71461011b578063057ff8701461014b578063189ae5f2146101675780631934741b14610183575b600080fd5b610135600480360381019061013091906115ff565b610331565b604051610142919061198c565b60405180910390f35b6101656004803603810190610160919061148f565b6103ab565b005b610181600480360381019061017c9190611628565b6104ca565b005b61019d6004803603810190610198919061142c565b6104ec565b005b6101b960048036038101906101b4919061142c565b610626565b005b6101d560048036038101906101d0919061159a565b61073f565b6040516101e291906119a7565b60405180910390f35b610205600480360381019061020091906115c3565b61075f565b005b610221600480360381019061021c91906115c3565b610780565b005b61022b610803565b005b6102356108ba565b005b61023f6108ce565b60405161024c91906118e0565b60405180910390f35b61026f600480360381019061026a91906115c3565b6108f7565b60405161027c919061198c565b60405180910390f35b61029f600480360381019061029a9190611530565b610962565b005b6102a96109f5565b6040516102b691906119a7565b60405180910390f35b6102d960048036038101906102d49190611530565b6109fc565b005b6102f560048036038101906102f091906115c3565b610a8f565b005b610311600480360381019061030c9190611403565b610ab0565b005b61031b610b34565b60405161032891906119a7565b60405180910390f35b60007f7965db0b000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614806103a457506103a382610b58565b5b9050919050565b7f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b9296103d581610bc2565b600060045414806103e857506001600454115b610427576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161041e90611a64565b60405180910390fd5b60008790508073ffffffffffffffffffffffffffffffffffffffff1663f242432a88888888886040518663ffffffff1660e01b815260040161046d959493929190611932565b600060405180830381600087803b15801561048757600080fd5b505af115801561049b573d6000803e3d6000fd5b50505050600160045411156104c05760016004546104b99190611c24565b6004819055505b5050505050505050565b6104d2610bd6565b826002819055508160038190555080600481905550505050565b7f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b92961051681610bc2565b6000600254148061052957506001600254115b610568576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161055f90611a64565b60405180910390fd5b60008590508073ffffffffffffffffffffffffffffffffffffffff166323b872dd8686866040518463ffffffff1660e01b81526004016105aa939291906118fb565b602060405180830381600087803b1580156105c457600080fd5b505af11580156105d8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105fc9190611571565b506001600254111561061e5760016002546106179190611c24565b6002819055505b505050505050565b7f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b92961065081610bc2565b6000600354148061066357506001600354115b6106a2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161069990611a64565b60405180910390fd5b60008590508073ffffffffffffffffffffffffffffffffffffffff166342842e0e8686866040518463ffffffff1660e01b81526004016106e4939291906118fb565b600060405180830381600087803b1580156106fe57600080fd5b505af1158015610712573d6000803e3d6000fd5b50505050600160035411156107375760016003546107309190611c24565b6003819055505b505050505050565b600060016000838152602001908152602001600020600101549050919050565b6107688261073f565b61077181610bc2565b61077b8383610c54565b505050565b610788610d34565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16146107f5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107ec90611a84565b60405180910390fd5b6107ff8282610d3c565b5050565b61080b610bd6565b60003373ffffffffffffffffffffffffffffffffffffffff164760405161083190611891565b60006040518083038185875af1925050503d806000811461086e576040519150601f19603f3d011682016040523d82523d6000602084013e610873565b606091505b50509050806108b7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108ae90611a44565b60405180910390fd5b50565b6108c2610bd6565b6108cc6000610e1e565b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60006001600084815260200190815260200160002060000160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b61096a610bd6565b60005b81518110156109f1576109e07f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b9298383815181106109d3577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b6020026020010151610ee2565b806109ea90611d73565b905061096d565b5050565b6000801b81565b610a04610bd6565b60005b8151811015610a8b57610a7a7f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929838381518110610a6d577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b6020026020010151610d3c565b80610a8490611d73565b9050610a07565b5050565b610a988261073f565b610aa181610bc2565b610aab8383610d3c565b505050565b610ab8610bd6565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610b28576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b1f90611a04565b60405180910390fd5b610b3181610e1e565b50565b7f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b92981565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b610bd381610bce610d34565b610ef0565b50565b610bde610d34565b73ffffffffffffffffffffffffffffffffffffffff16610bfc6108ce565b73ffffffffffffffffffffffffffffffffffffffff1614610c52576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c4990611a24565b60405180910390fd5b565b610c5e82826108f7565b610d3057600180600084815260200190815260200160002060000160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550610cd5610d34565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45b5050565b600033905090565b610d4682826108f7565b15610e1a5760006001600084815260200190815260200160002060000160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550610dbf610d34565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16837ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b60405160405180910390a45b5050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b610eec8282610c54565b5050565b610efa82826108f7565b610f7157610f0781610f75565b610f158360001c6020610fa2565b604051602001610f269291906118a6565b6040516020818303038152906040526040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f6891906119c2565b60405180910390fd5b5050565b6060610f9b8273ffffffffffffffffffffffffffffffffffffffff16601460ff16610fa2565b9050919050565b606060006002836002610fb59190611bca565b610fbf9190611b74565b67ffffffffffffffff811115610ffe577f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040519080825280601f01601f1916602001820160405280156110305781602001600182028036833780820191505090505b5090507f30000000000000000000000000000000000000000000000000000000000000008160008151811061108e577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053507f780000000000000000000000000000000000000000000000000000000000000081600181518110611118577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350600060018460026111589190611bca565b6111629190611b74565b90505b600181111561124e577f3031323334353637383961626364656600000000000000000000000000000000600f8616601081106111ca577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b1a60f81b828281518110611207577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350600485901c94508061124790611d18565b9050611165565b5060008414611292576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611289906119e4565b60405180910390fd5b8091505092915050565b60006112af6112aa84611ac9565b611aa4565b905080838252602082019050828560208602820111156112ce57600080fd5b60005b858110156112fe57816112e48882611346565b8452602084019350602083019250506001810190506112d1565b5050509392505050565b600061131b61131684611af5565b611aa4565b90508281526020810184848401111561133357600080fd5b61133e848285611cd6565b509392505050565b60008135905061135581611fc2565b92915050565b600082601f83011261136c57600080fd5b813561137c84826020860161129c565b91505092915050565b60008151905061139481611fd9565b92915050565b6000813590506113a981611ff0565b92915050565b6000813590506113be81612007565b92915050565b600082601f8301126113d557600080fd5b81356113e5848260208601611308565b91505092915050565b6000813590506113fd8161201e565b92915050565b60006020828403121561141557600080fd5b600061142384828501611346565b91505092915050565b6000806000806080858703121561144257600080fd5b600061145087828801611346565b945050602061146187828801611346565b935050604061147287828801611346565b9250506060611483878288016113ee565b91505092959194509250565b60008060008060008060c087890312156114a857600080fd5b60006114b689828a01611346565b96505060206114c789828a01611346565b95505060406114d889828a01611346565b94505060606114e989828a016113ee565b93505060806114fa89828a016113ee565b92505060a087013567ffffffffffffffff81111561151757600080fd5b61152389828a016113c4565b9150509295509295509295565b60006020828403121561154257600080fd5b600082013567ffffffffffffffff81111561155c57600080fd5b6115688482850161135b565b91505092915050565b60006020828403121561158357600080fd5b600061159184828501611385565b91505092915050565b6000602082840312156115ac57600080fd5b60006115ba8482850161139a565b91505092915050565b600080604083850312156115d657600080fd5b60006115e48582860161139a565b92505060206115f585828601611346565b9150509250929050565b60006020828403121561161157600080fd5b600061161f848285016113af565b91505092915050565b60008060006060848603121561163d57600080fd5b600061164b868287016113ee565b935050602061165c868287016113ee565b925050604061166d868287016113ee565b9150509250925092565b61168081611c58565b82525050565b61168f81611c6a565b82525050565b61169e81611c76565b82525050565b60006116af82611b26565b6116b98185611b3c565b93506116c9818560208601611ce5565b6116d281611e1a565b840191505092915050565b60006116e882611b31565b6116f28185611b58565b9350611702818560208601611ce5565b61170b81611e1a565b840191505092915050565b600061172182611b31565b61172b8185611b69565b935061173b818560208601611ce5565b80840191505092915050565b6000611754602083611b58565b915061175f82611e2b565b602082019050919050565b6000611777602683611b58565b915061178282611e54565b604082019050919050565b600061179a602083611b58565b91506117a582611ea3565b602082019050919050565b60006117bd600083611b4d565b91506117c882611ecc565b600082019050919050565b60006117e0601083611b58565b91506117eb82611ecf565b602082019050919050565b6000611803601783611b69565b915061180e82611ef8565b601782019050919050565b6000611826601283611b58565b915061183182611f21565b602082019050919050565b6000611849601183611b69565b915061185482611f4a565b601182019050919050565b600061186c602f83611b58565b915061187782611f73565b604082019050919050565b61188b81611ccc565b82525050565b600061189c826117b0565b9150819050919050565b60006118b1826117f6565b91506118bd8285611716565b91506118c88261183c565b91506118d48284611716565b91508190509392505050565b60006020820190506118f56000830184611677565b92915050565b60006060820190506119106000830186611677565b61191d6020830185611677565b61192a6040830184611882565b949350505050565b600060a0820190506119476000830188611677565b6119546020830187611677565b6119616040830186611882565b61196e6060830185611882565b818103608083015261198081846116a4565b90509695505050505050565b60006020820190506119a16000830184611686565b92915050565b60006020820190506119bc6000830184611695565b92915050565b600060208201905081810360008301526119dc81846116dd565b905092915050565b600060208201905081810360008301526119fd81611747565b9050919050565b60006020820190508181036000830152611a1d8161176a565b9050919050565b60006020820190508181036000830152611a3d8161178d565b9050919050565b60006020820190508181036000830152611a5d816117d3565b9050919050565b60006020820190508181036000830152611a7d81611819565b9050919050565b60006020820190508181036000830152611a9d8161185f565b9050919050565b6000611aae611abf565b9050611aba8282611d42565b919050565b6000604051905090565b600067ffffffffffffffff821115611ae457611ae3611deb565b5b602082029050602081019050919050565b600067ffffffffffffffff821115611b1057611b0f611deb565b5b611b1982611e1a565b9050602081019050919050565b600081519050919050565b600081519050919050565b600082825260208201905092915050565b600081905092915050565b600082825260208201905092915050565b600081905092915050565b6000611b7f82611ccc565b9150611b8a83611ccc565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115611bbf57611bbe611dbc565b5b828201905092915050565b6000611bd582611ccc565b9150611be083611ccc565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0483118215151615611c1957611c18611dbc565b5b828202905092915050565b6000611c2f82611ccc565b9150611c3a83611ccc565b925082821015611c4d57611c4c611dbc565b5b828203905092915050565b6000611c6382611cac565b9050919050565b60008115159050919050565b6000819050919050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b82818337600083830152505050565b60005b83811015611d03578082015181840152602081019050611ce8565b83811115611d12576000848401525b50505050565b6000611d2382611ccc565b91506000821415611d3757611d36611dbc565b5b600182039050919050565b611d4b82611e1a565b810181811067ffffffffffffffff82111715611d6a57611d69611deb565b5b80604052505050565b6000611d7e82611ccc565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415611db157611db0611dbc565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b7f537472696e67733a20686578206c656e67746820696e73756666696369656e74600082015250565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b50565b7f5472616e73666572206661696c65642e00000000000000000000000000000000600082015250565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000600082015250565b7f43414c4c5f4c494d49545f524541434845440000000000000000000000000000600082015250565b7f206973206d697373696e6720726f6c6520000000000000000000000000000000600082015250565b7f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560008201527f20726f6c657320666f722073656c660000000000000000000000000000000000602082015250565b611fcb81611c58565b8114611fd657600080fd5b50565b611fe281611c6a565b8114611fed57600080fd5b50565b611ff981611c76565b811461200457600080fd5b50565b61201081611c80565b811461201b57600080fd5b50565b61202781611ccc565b811461203257600080fd5b5056fea2646970667358221220342d6999ca369c3f0717a44d7770be4acf2c89bce31c34a0d4ac995866e0245464736f6c63430008040033";

type AkaMarketConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: AkaMarketConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class AkaMarket__factory extends ContractFactory {
  constructor(...args: AkaMarketConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<AkaMarket> {
    return super.deploy(overrides || {}) as Promise<AkaMarket>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): AkaMarket {
    return super.attach(address) as AkaMarket;
  }
  override connect(signer: Signer): AkaMarket__factory {
    return super.connect(signer) as AkaMarket__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AkaMarketInterface {
    return new utils.Interface(_abi) as AkaMarketInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): AkaMarket {
    return new Contract(address, _abi, signerOrProvider) as AkaMarket;
  }
}
