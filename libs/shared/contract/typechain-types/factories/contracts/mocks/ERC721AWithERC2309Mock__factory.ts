/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BigNumberish,
  Overrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  ERC721AWithERC2309Mock,
  ERC721AWithERC2309MockInterface,
} from "../../../contracts/mocks/ERC721AWithERC2309Mock";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name_",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol_",
        type: "string",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "quantity",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "mintInConstructor",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "ApprovalCallerNotOwnerNorApproved",
    type: "error",
  },
  {
    inputs: [],
    name: "ApprovalQueryForNonexistentToken",
    type: "error",
  },
  {
    inputs: [],
    name: "BalanceQueryForZeroAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "LockUntilMustBeUpperThanCurrentValue",
    type: "error",
  },
  {
    inputs: [],
    name: "LockUntilZero",
    type: "error",
  },
  {
    inputs: [],
    name: "MintERC2309QuantityExceedsLimit",
    type: "error",
  },
  {
    inputs: [],
    name: "MintToZeroAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "MintZeroQuantity",
    type: "error",
  },
  {
    inputs: [],
    name: "OwnerQueryForNonexistentToken",
    type: "error",
  },
  {
    inputs: [],
    name: "OwnershipNotInitializedForExtraData",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferCallerNotOwnerNorApproved",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferFromIncorrectOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferLockedToken",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferToNonERC721ReceiverImplementer",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferToZeroAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "URIQueryForNonexistentToken",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "fromTokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "toTokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "ConsecutiveTransfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
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
    name: "approve",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
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
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
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
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint64",
        name: "_lockUntil",
        type: "uint64",
      },
    ],
    name: "lock",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
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
      {
        internalType: "uint64",
        name: "_lockUntil",
        type: "uint64",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "lockTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "lockUntil",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "mintOneERC2309",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "mintTenERC2309",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
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
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
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
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
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
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
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
    name: "transferFrom",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162002ab038038062002ab08339818101604052810190620000379190620005b4565b84848160029080519060200190620000519291906200044d565b5080600390805190602001906200006a9291906200044d565b506200007b620000a860201b60201c565b600081905550505080156200009d576200009c8383620000b160201b60201c565b5b505050505062000978565b60006001905090565b600080549050600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614156200011f576040517f2e07630000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008214156200015b576040517fb562e8dd00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b61138882111562000198576040517f3db1f9af00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b620001ad6000848385620002e460201b60201c565b600160406001901b178202600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055506200023c836200021e6000866000620003d360201b60201c565b6200022f856200040360201b60201c565b176200041360201b60201c565b60046000838152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff16827fdeaa91b6123d068f5821d0fb0678463d1a8a6079fe8af5de3ce5e896dcf9133d600186860103604051620002b9919062000679565b60405180910390a4818101600081905550620002df60008483856200043e60201b60201c565b505050565b60005b81811015620003cc576000600860008386620003049190620006f5565b815260200190815260200160002060009054906101000a900467ffffffffffffffff1667ffffffffffffffff16141580156200037e57506008600082856200034d9190620006f5565b815260200190815260200160002060009054906101000a900467ffffffffffffffff1667ffffffffffffffff164211155b15620003b6576040517f750e912300000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b8080620003c3906200083e565b915050620002e7565b5050505050565b60008060e883901c905060e8620003f28686846200044460201b60201c565b62ffffff16901b9150509392505050565b60006001821460e11b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff83169250814260a01b178317905092915050565b50505050565b60009392505050565b8280546200045b90620007d2565b90600052602060002090601f0160209004810192826200047f5760008555620004cb565b82601f106200049a57805160ff1916838001178555620004cb565b82800160010185558215620004cb579182015b82811115620004ca578251825591602001919060010190620004ad565b5b509050620004da9190620004de565b5090565b5b80821115620004f9576000816000905550600101620004df565b5090565b6000620005146200050e84620006bf565b62000696565b9050828152602081018484840111156200052d57600080fd5b6200053a8482856200079c565b509392505050565b60008151905062000553816200092a565b92915050565b6000815190506200056a8162000944565b92915050565b600082601f8301126200058257600080fd5b815162000594848260208601620004fd565b91505092915050565b600081519050620005ae816200095e565b92915050565b600080600080600060a08688031215620005cd57600080fd5b600086015167ffffffffffffffff811115620005e857600080fd5b620005f68882890162000570565b955050602086015167ffffffffffffffff8111156200061457600080fd5b620006228882890162000570565b9450506040620006358882890162000542565b935050606062000648888289016200059d565b92505060806200065b8882890162000559565b9150509295509295909350565b620006738162000792565b82525050565b600060208201905062000690600083018462000668565b92915050565b6000620006a2620006b5565b9050620006b0828262000808565b919050565b6000604051905090565b600067ffffffffffffffff821115620006dd57620006dc620008ea565b5b620006e88262000919565b9050602081019050919050565b6000620007028262000792565b91506200070f8362000792565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156200074757620007466200088c565b5b828201905092915050565b60006200075f8262000772565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b60005b83811015620007bc5780820151818401526020810190506200079f565b83811115620007cc576000848401525b50505050565b60006002820490506001821680620007eb57607f821691505b60208210811415620008025762000801620008bb565b5b50919050565b620008138262000919565b810181811067ffffffffffffffff82111715620008355762000834620008ea565b5b80604052505050565b60006200084b8262000792565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8214156200088157620008806200088c565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b620009358162000752565b81146200094157600080fd5b50565b6200094f8162000766565b81146200095b57600080fd5b50565b620009698162000792565b81146200097557600080fd5b50565b61212880620009886000396000f3fe6080604052600436106101145760003560e01c806342842e0e116100a0578063a22cb46511610064578063a22cb4651461039a578063ad46468f146103c3578063b88d4fde146103ec578063c87b56dd14610408578063e985e9c51461044557610114565b806342842e0e146102b05780636352211e146102cc57806370a082311461030957806394cfadd71461034657806395d89b411461036f57610114565b80630ceea305116100e75780630ceea305146101da57806318160ddd14610217578063201732921461024257806323b872dd1461026b5780633efa99791461028757610114565b806301ffc9a71461011957806306fdde0314610156578063081812fc14610181578063095ea7b3146101be575b600080fd5b34801561012557600080fd5b50610140600480360381019061013b9190611ae8565b610482565b60405161014d9190611d09565b60405180910390f35b34801561016257600080fd5b5061016b610514565b6040516101789190611d24565b60405180910390f35b34801561018d57600080fd5b506101a860048036038101906101a39190611b3a565b6105a6565b6040516101b59190611ca2565b60405180910390f35b6101d860048036038101906101d39190611aac565b610625565b005b3480156101e657600080fd5b5061020160048036038101906101fc9190611b3a565b610769565b60405161020e9190611d61565b60405180910390f35b34801561022357600080fd5b5061022c610790565b6040516102399190611d46565b60405180910390f35b34801561024e57600080fd5b50610269600480360381019061026491906119e1565b6107a7565b005b61028560048036038101906102809190611917565b6107c4565b005b34801561029357600080fd5b506102ae60048036038101906102a99190611b63565b610ae9565b005b6102ca60048036038101906102c59190611917565b610b75565b005b3480156102d857600080fd5b506102f360048036038101906102ee9190611b3a565b610b95565b6040516103009190611ca2565b60405180910390f35b34801561031557600080fd5b50610330600480360381019061032b91906118b2565b610ba7565b60405161033d9190611d46565b60405180910390f35b34801561035257600080fd5b5061036d600480360381019061036891906118b2565b610c60565b005b34801561037b57600080fd5b50610384610c6e565b6040516103919190611d24565b60405180910390f35b3480156103a657600080fd5b506103c160048036038101906103bc9190611a70565b610d00565b005b3480156103cf57600080fd5b506103ea60048036038101906103e591906118b2565b610e0b565b005b61040660048036038101906104019190611966565b610e19565b005b34801561041457600080fd5b5061042f600480360381019061042a9190611b3a565b610e8c565b60405161043c9190611d24565b60405180910390f35b34801561045157600080fd5b5061046c600480360381019061046791906118db565b610f2b565b6040516104799190611d09565b60405180910390f35b60006301ffc9a760e01b827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614806104dd57506380ac58cd60e01b827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b8061050d5750635b5e139f60e01b827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b9050919050565b60606002805461052390611f35565b80601f016020809104026020016040519081016040528092919081815260200182805461054f90611f35565b801561059c5780601f106105715761010080835404028352916020019161059c565b820191906000526020600020905b81548152906001019060200180831161057f57829003601f168201915b5050505050905090565b60006105b182610fbf565b6105e7576040517fcf4700e400000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6006600083815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b600061063082610b95565b90508073ffffffffffffffffffffffffffffffffffffffff1661065161101e565b73ffffffffffffffffffffffffffffffffffffffff16146106b45761067d8161067861101e565b610f2b565b6106b3576040517fcfb3b94200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5b826006600084815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550818373ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a4505050565b60086020528060005260406000206000915054906101000a900467ffffffffffffffff1681565b600061079a611026565b6001546000540303905090565b6107b385858584610e19565b6107bd838361102f565b5050505050565b60006107cf82611166565b90508373ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610836576040517fa114810000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008061084284611234565b91509150610858818761085361101e565b61125b565b6108a45761086d8661086861101e565b610f2b565b6108a3576040517f59c896be00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5b600073ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff16141561090b576040517fea553b3400000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b610918868686600161129f565b801561092357600082555b600560008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600081546001900391905081905550600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008154600101919050819055506109f1856109cd888887611384565b7c0200000000000000000000000000000000000000000000000000000000176113ac565b600460008681526020019081526020016000208190555060007c020000000000000000000000000000000000000000000000000000000084161415610a79576000600185019050600060046000838152602001908152602001600020541415610a77576000548114610a76578360046000838152602001908152602001600020819055505b5b505b838573ffffffffffffffffffffffffffffffffffffffff168773ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4610ae186868660016113d7565b505050505050565b6000610af483610b95565b9050600080610b0285611234565b91509150610b188184610b1361101e565b61125b565b610b6457610b2d83610b2861101e565b610f2b565b610b63576040517f59c896be00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5b610b6e858561102f565b5050505050565b610b9083838360405180602001604052806000815250610e19565b505050565b6000610ba082611166565b9050919050565b60008073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610c0f576040517f8f4eb60400000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b67ffffffffffffffff600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054169050919050565b610c6b8160016113dd565b50565b606060038054610c7d90611f35565b80601f0160208091040260200160405190810160405280929190818152602001828054610ca990611f35565b8015610cf65780601f10610ccb57610100808354040283529160200191610cf6565b820191906000526020600020905b815481529060010190602001808311610cd957829003601f168201915b5050505050905090565b8060076000610d0d61101e565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff16610dba61101e565b73ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3183604051610dff9190611d09565b60405180910390a35050565b610e1681600a6113dd565b50565b610e248484846107c4565b60008373ffffffffffffffffffffffffffffffffffffffff163b14610e8657610e4f848484846115e3565b610e85576040517fd1a57ed600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5b50505050565b6060610e9782610fbf565b610ecd576040517fa14c4b5000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000610ed7611743565b9050600081511415610ef85760405180602001604052806000815250610f23565b80610f028461175a565b604051602001610f13929190611c7e565b6040516020818303038152906040525b915050919050565b6000600760008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b600081610fca611026565b11158015610fd9575060005482105b8015611017575060007c0100000000000000000000000000000000000000000000000000000000600460008581526020019081526020016000205416145b9050919050565b600033905090565b60006001905090565b60008167ffffffffffffffff161415611074576040517fccfbd56600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60006008600084815260200190815260200160002060009054906101000a900467ffffffffffffffff1667ffffffffffffffff16141580156110f157506008600083815260200190815260200160002060009054906101000a900467ffffffffffffffff1667ffffffffffffffff168167ffffffffffffffff1611155b15611128576040517f92fe021400000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b806008600084815260200190815260200160002060006101000a81548167ffffffffffffffff021916908367ffffffffffffffff1602179055505050565b60008082905080611175611026565b116111fd576000548110156111fc5760006004600083815260200190815260200160002054905060007c0100000000000000000000000000000000000000000000000000000000821614156111fa575b60008114156111f05760046000836001900393508381526020019081526020016000205490506111c5565b809250505061122f565b505b5b6040517fdf2d9b4200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b919050565b60008060006006600085815260200190815260200160002090508092508254915050915091565b600073ffffffffffffffffffffffffffffffffffffffff8316925073ffffffffffffffffffffffffffffffffffffffff821691508382148383141790509392505050565b60005b8181101561137d5760006008600083866112bc9190611e15565b815260200190815260200160002060009054906101000a900467ffffffffffffffff1667ffffffffffffffff161415801561133357506008600082856113029190611e15565b815260200190815260200160002060009054906101000a900467ffffffffffffffff1667ffffffffffffffff164211155b1561136a576040517f750e912300000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b808061137590611f98565b9150506112a2565b5050505050565b60008060e883901c905060e861139b8686846117b3565b62ffffff16901b9150509392505050565b600073ffffffffffffffffffffffffffffffffffffffff83169250814260a01b178317905092915050565b50505050565b600080549050600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16141561144a576040517f2e07630000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000821415611485576040517fb562e8dd00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6113888211156114c1576040517f3db1f9af00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6114ce600084838561129f565b600160406001901b178202600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550611545836115366000866000611384565b61153f856117bc565b176113ac565b60046000838152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff16827fdeaa91b6123d068f5821d0fb0678463d1a8a6079fe8af5de3ce5e896dcf9133d6001868601036040516115c09190611d46565b60405180910390a48181016000819055506115de60008483856113d7565b505050565b60008373ffffffffffffffffffffffffffffffffffffffff1663150b7a0261160961101e565b8786866040518563ffffffff1660e01b815260040161162b9493929190611cbd565b602060405180830381600087803b15801561164557600080fd5b505af192505050801561167657506040513d601f19601f820116820180604052508101906116739190611b11565b60015b6116f0573d80600081146116a6576040519150601f19603f3d011682016040523d82523d6000602084013e6116ab565b606091505b506000815114156116e8576040517fd1a57ed600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b805181602001fd5b63150b7a0260e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614915050949350505050565b606060405180602001604052806000815250905090565b606060a060405101806040526020810391506000825281835b60011561179e57600184039350600a81066030018453600a81049050806117995761179e565b611773565b50828103602084039350808452505050919050565b60009392505050565b60006001821460e11b9050919050565b60006117df6117da84611da1565b611d7c565b9050828152602081018484840111156117f757600080fd5b611802848285611ef3565b509392505050565b6000813590506118198161207f565b92915050565b60008135905061182e81612096565b92915050565b600081359050611843816120ad565b92915050565b600081519050611858816120ad565b92915050565b600082601f83011261186f57600080fd5b813561187f8482602086016117cc565b91505092915050565b600081359050611897816120c4565b92915050565b6000813590506118ac816120db565b92915050565b6000602082840312156118c457600080fd5b60006118d28482850161180a565b91505092915050565b600080604083850312156118ee57600080fd5b60006118fc8582860161180a565b925050602061190d8582860161180a565b9150509250929050565b60008060006060848603121561192c57600080fd5b600061193a8682870161180a565b935050602061194b8682870161180a565b925050604061195c86828701611888565b9150509250925092565b6000806000806080858703121561197c57600080fd5b600061198a8782880161180a565b945050602061199b8782880161180a565b93505060406119ac87828801611888565b925050606085013567ffffffffffffffff8111156119c957600080fd5b6119d58782880161185e565b91505092959194509250565b600080600080600060a086880312156119f957600080fd5b6000611a078882890161180a565b9550506020611a188882890161180a565b9450506040611a2988828901611888565b9350506060611a3a8882890161189d565b925050608086013567ffffffffffffffff811115611a5757600080fd5b611a638882890161185e565b9150509295509295909350565b60008060408385031215611a8357600080fd5b6000611a918582860161180a565b9250506020611aa28582860161181f565b9150509250929050565b60008060408385031215611abf57600080fd5b6000611acd8582860161180a565b9250506020611ade85828601611888565b9150509250929050565b600060208284031215611afa57600080fd5b6000611b0884828501611834565b91505092915050565b600060208284031215611b2357600080fd5b6000611b3184828501611849565b91505092915050565b600060208284031215611b4c57600080fd5b6000611b5a84828501611888565b91505092915050565b60008060408385031215611b7657600080fd5b6000611b8485828601611888565b9250506020611b958582860161189d565b9150509250929050565b611ba881611e6b565b82525050565b611bb781611e7d565b82525050565b6000611bc882611dd2565b611bd28185611de8565b9350611be2818560208601611f02565b611beb8161206e565b840191505092915050565b6000611c0182611ddd565b611c0b8185611df9565b9350611c1b818560208601611f02565b611c248161206e565b840191505092915050565b6000611c3a82611ddd565b611c448185611e0a565b9350611c54818560208601611f02565b80840191505092915050565b611c6981611ed5565b82525050565b611c7881611edf565b82525050565b6000611c8a8285611c2f565b9150611c968284611c2f565b91508190509392505050565b6000602082019050611cb76000830184611b9f565b92915050565b6000608082019050611cd26000830187611b9f565b611cdf6020830186611b9f565b611cec6040830185611c60565b8181036060830152611cfe8184611bbd565b905095945050505050565b6000602082019050611d1e6000830184611bae565b92915050565b60006020820190508181036000830152611d3e8184611bf6565b905092915050565b6000602082019050611d5b6000830184611c60565b92915050565b6000602082019050611d766000830184611c6f565b92915050565b6000611d86611d97565b9050611d928282611f67565b919050565b6000604051905090565b600067ffffffffffffffff821115611dbc57611dbb61203f565b5b611dc58261206e565b9050602081019050919050565b600081519050919050565b600081519050919050565b600082825260208201905092915050565b600082825260208201905092915050565b600081905092915050565b6000611e2082611ed5565b9150611e2b83611ed5565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115611e6057611e5f611fe1565b5b828201905092915050565b6000611e7682611eb5565b9050919050565b60008115159050919050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600067ffffffffffffffff82169050919050565b82818337600083830152505050565b60005b83811015611f20578082015181840152602081019050611f05565b83811115611f2f576000848401525b50505050565b60006002820490506001821680611f4d57607f821691505b60208210811415611f6157611f60612010565b5b50919050565b611f708261206e565b810181811067ffffffffffffffff82111715611f8f57611f8e61203f565b5b80604052505050565b6000611fa382611ed5565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415611fd657611fd5611fe1565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b61208881611e6b565b811461209357600080fd5b50565b61209f81611e7d565b81146120aa57600080fd5b50565b6120b681611e89565b81146120c157600080fd5b50565b6120cd81611ed5565b81146120d857600080fd5b50565b6120e481611edf565b81146120ef57600080fd5b5056fea2646970667358221220ef617e442349537c4c2b2d0c3522ea65e86ce8da57b6604b32a7d5240f72c53464736f6c63430008040033";

type ERC721AWithERC2309MockConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERC721AWithERC2309MockConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERC721AWithERC2309Mock__factory extends ContractFactory {
  constructor(...args: ERC721AWithERC2309MockConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    name_: PromiseOrValue<string>,
    symbol_: PromiseOrValue<string>,
    to: PromiseOrValue<string>,
    quantity: PromiseOrValue<BigNumberish>,
    mintInConstructor: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ERC721AWithERC2309Mock> {
    return super.deploy(
      name_,
      symbol_,
      to,
      quantity,
      mintInConstructor,
      overrides || {}
    ) as Promise<ERC721AWithERC2309Mock>;
  }
  override getDeployTransaction(
    name_: PromiseOrValue<string>,
    symbol_: PromiseOrValue<string>,
    to: PromiseOrValue<string>,
    quantity: PromiseOrValue<BigNumberish>,
    mintInConstructor: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      name_,
      symbol_,
      to,
      quantity,
      mintInConstructor,
      overrides || {}
    );
  }
  override attach(address: string): ERC721AWithERC2309Mock {
    return super.attach(address) as ERC721AWithERC2309Mock;
  }
  override connect(signer: Signer): ERC721AWithERC2309Mock__factory {
    return super.connect(signer) as ERC721AWithERC2309Mock__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC721AWithERC2309MockInterface {
    return new utils.Interface(_abi) as ERC721AWithERC2309MockInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERC721AWithERC2309Mock {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as ERC721AWithERC2309Mock;
  }
}
