// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ERC721A.sol";
import "./IERC721A.sol";
import "./extensions/ERC721AQueryable.sol";
import "./extensions/IERC721AQueryable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract ERC721AToken is Ownable, ERC721A, ERC721AQueryable, Pausable {
    using Strings for uint256;

    struct SaleInfo {
        uint256 amount;
        uint256 price;
        uint64 startTime;
        uint64 endTime;
        bytes32 merkleRoot;
        uint256 perTx;
        uint256 perWallet;
        uint256 maxLimit;
        uint256 minted;
    }

    string private metadataUri;
    string private metadataSuffix = "";
    uint256 public maxSupply;

    mapping(uint16 => SaleInfo) public saleInfos;
    mapping(uint16 => mapping(address => uint256)) public mintLogs;
    uint16 public saleInfoNum = 0;
    bool private isRevealed = false;

    constructor(
        string memory name,
        string memory symbol,
        uint256 _maxSupply,
        string memory _metadataUri,
        bool _isRevealed
    ) ERC721A(name, symbol) {
        maxSupply = _maxSupply;
        metadataUri = _metadataUri;
        isRevealed = _isRevealed;
    }

    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        require(_exists(_tokenId), "ERC721Metadata: URI query for nonexistent token");
        if (!isRevealed) return string(abi.encodePacked(metadataUri, "prereveal", metadataSuffix));
        return string(abi.encodePacked(metadataUri, Strings.toString(_tokenId), metadataSuffix));
    }

    function contractURI() public view returns (string memory) {
        return string(abi.encodePacked(metadataUri, "contract", metadataSuffix));
    }

    function mint(
        uint16 step,
        uint256 amount,
        bytes32[] memory proof
    ) external payable whenNotPaused {
        _checkIsMintable(step, amount);
        if (!isWhiteListed(msg.sender, proof, step)) revert("Not in whitelist");
        _logMint(step, amount);
        _safeMint(msg.sender, amount);
    }

    function _logMint(uint16 step, uint256 quantity) private {
        mintLogs[step][msg.sender] += quantity;
        saleInfos[step].minted += quantity;
    }

    function _checkIsMintable(uint16 step, uint256 quantity) internal returns (bool) {
        if (step >= saleInfoNum) revert("Not exist mint step");
        SaleInfo memory saleInfo = saleInfos[step];
        if (block.timestamp < saleInfo.startTime) revert("Minting hasn't started yet");
        if (block.timestamp > saleInfo.endTime) revert("Minting has ended");
        if (saleInfo.amount < saleInfo.minted + quantity) revert("Sold out in this step");
        if (_totalMinted() + quantity > maxSupply) revert("Sold out for total supply");
        if (saleInfo.maxLimit != 0 && _totalMinted() + quantity > saleInfo.maxLimit) revert("Sold out for max limit");
        if (saleInfo.perTx != 0 && saleInfo.perTx < quantity)
            revert("Exceeds the maximum number of mints per transaction");
        if (saleInfo.perWallet != 0 && saleInfo.perWallet < mintLogs[step][msg.sender] + quantity)
            revert("Exceeds the maximum number of mints per wallet");
        if (quantity == 0) revert("Invalid quantity");
        if (msg.value != saleInfo.price * quantity) revert("Invalid value");
        return true;
    }

    function burn(uint256 tokenId) external onlyOwner {
        _burn(tokenId);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function setSaleInfoList(
        uint256[] memory amounts,
        uint256[] memory prices,
        uint64[] memory startTimes,
        uint64[] memory endTimes,
        bytes32[] memory merkleRoots,
        uint256[] memory perTxs,
        uint256[] memory perWallets,
        uint256[] memory maxLimits,
        uint16 startIdx
    ) external onlyOwner {
        require(startIdx <= saleInfoNum, "startIdx is out of range");
        for (uint16 i = 0; i < amounts.length; i++)
            saleInfos[i + startIdx] = SaleInfo(
                amounts[i],
                prices[i],
                startTimes[i],
                endTimes[i],
                merkleRoots[i],
                perTxs[i],
                perWallets[i],
                maxLimits[i],
                saleInfos[i + startIdx].minted
            );
        if (startIdx + amounts.length > saleInfoNum) saleInfoNum = startIdx + uint16(amounts.length);
    }

    function setMetadata(
        string calldata _metadataUri,
        string calldata _metadataSuffix,
        bool _isReveal
    ) external onlyOwner {
        metadataUri = _metadataUri;
        metadataSuffix = _metadataSuffix;
        isRevealed = _isReveal;
    }

    function isWhiteListed(
        address _account,
        bytes32[] memory _proof,
        uint16 step
    ) public view returns (bool) {
        return
            saleInfos[step].merkleRoot == 0x0 || MerkleProof.verify(_proof, saleInfos[step].merkleRoot, leaf(_account));
    }

    function leaf(address _account) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_account));
    }

    function withdraw(uint256 amount) public onlyOwner {
        payable(msg.sender).transfer(amount);
    }

    function unlock(uint256 tokenId) external onlyOwner {
        _unlock(tokenId);
    }

    function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256) {
        uint256[] memory tokenIds = tokensOfOwner(owner);
        if (tokenIds.length <= index) revert("Index out of range");
        return tokenIds[index];
    }

    function tokenByIndex(uint256 index) public view returns (uint256) {
        if (totalSupply() <= index) revert("Index out of range");
        return _startTokenId() + index;
    }
}
