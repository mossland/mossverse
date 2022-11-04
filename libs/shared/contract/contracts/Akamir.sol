// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./ERC721A.sol";

contract Akamir is Ownable, ERC721A, ReentrancyGuard {
    using Address for address;
    using Strings for uint256;
    uint256 public immutable maxPerAddressDuringMint;
    uint256 public immutable amountForDevs;
    uint256 public immutable amountForAuctionAndDev;
    uint256 public immutable collectionSize;

    uint256 private _revealLimit = 0;
    string private _notRevealedUri;
    string private _contractUri;
    string private _baseExtension = ".json";
    uint32 private publicSaleKey;

    mapping(address => uint256) public allowlist;
    address[] allowers;

    constructor(
        uint256 maxBatchSize_,
        uint256 collectionSize_,
        uint256 amountForAuctionAndDev_,
        uint256 amountForDevs_
    ) ERC721A("Akamir", "AKA") {
        maxPerAddressDuringMint = maxBatchSize_;
        amountForAuctionAndDev = amountForAuctionAndDev_;
        amountForDevs = amountForDevs_;
        collectionSize = collectionSize_;
        require(amountForAuctionAndDev_ <= collectionSize_, "larger collection size needed");
    }

    modifier callerIsUser() {
        require(tx.origin == msg.sender, "The caller is another contract");
        _;
    }

    function refundIfOver(uint256 price) private {
        require(msg.value >= price, "Need to send more ETH.");
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
    }

    // For marketing etc.
    function devMint(uint256 quantity, uint256 lockUntil) external onlyOwner {
        require(totalSupply() + quantity <= amountForDevs, "too many already minted before dev mint");
        require(quantity % maxPerAddressDuringMint == 0, "can only mint a multiple of the maxBatchSize");
        uint256 numChunks = quantity / maxPerAddressDuringMint;
        for (uint256 i = 0; i < numChunks; i++) {
            _safeMint(msg.sender, maxPerAddressDuringMint);
        }
    }

    function unlockToken(uint256 tokenId) external onlyOwner {
        _unlock(tokenId);
    }

    // // metadata URI
    string private _baseTokenURI;

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function setRevealLimit(uint256 revealLimit) external onlyOwner {
        _revealLimit = uint32(revealLimit);
    }

    function withdrawMoney() external onlyOwner nonReentrant {
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "Transfer failed.");
    }

    function getRevealLimit() public view onlyOwner returns (uint256) {
        return _revealLimit;
    }

    function numberMinted(address owner) public view returns (uint256) {
        return _numberMinted(owner);
    }

    function notRevealedURI() public view returns (string memory) {
        return _notRevealedUri;
    }

    function contractURI() public view returns (string memory) {
        return _contractUri;
    }

    function setNotRevealedURI(string calldata notRevealedUri) external onlyOwner {
        _notRevealedUri = notRevealedUri;
    }

    function setContractURI(string calldata contractUri) external onlyOwner {
        _contractUri = contractUri;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        // if (_reveal == false) {
        //   return _notRevealedUri;
        // }
        if (_revealLimit <= tokenId) {
            return _notRevealedUri;
        }
        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), _baseExtension))
                : "";
    }

    function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
        _baseExtension = _newBaseExtension;
    }
}
