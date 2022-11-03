// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./ERC721A.sol";

contract AkamirGenesis is Ownable, ERC721A, ReentrancyGuard {
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

    struct SaleConfig {
        uint32 auctionSaleStartTime;
        uint32 publicSaleStartTime;
        uint32 mintlistStartTime;
        uint256 auctionSaleStartPrice;
        uint256 auctionSaleEndPrice;
        uint32 auctionSaleLimit;
        uint32 auctionSaleDropCurve;
        uint32 auctionSaleDropInterval;
        uint256 mintlistPrice;
        uint256 publicPrice;
        uint32 saleLimit;
        uint32 discountInterval;
        uint32[] discountList;
    }

    SaleConfig public saleConfig;

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

    function auctionMint(uint256 quantity, uint256 lockUntil) external payable callerIsUser {
        uint256 _saleStartTime = uint256(saleConfig.auctionSaleStartTime);
        uint256 _saleStartPrice = uint256(saleConfig.auctionSaleStartPrice);
        uint256 _saleLimit = uint256(saleConfig.saleLimit);
        uint256 _auctionSaleLimit = uint256(saleConfig.auctionSaleLimit);

        require(
            _saleLimit != 0 &&
                _auctionSaleLimit != 0 &&
                _saleStartTime != 0 &&
                _saleStartPrice != 0 &&
                block.timestamp >= _saleStartTime,
            "auction sale has not begun yet"
        );
        require(
            totalSupply() + quantity <= amountForAuctionAndDev,
            "not enough remaining reserved for auction to support desired mint amount"
        );

        require(numberMinted(msg.sender) + quantity <= maxPerAddressDuringMint, "can not mint this many");
        require(totalSupply() + quantity <= _auctionSaleLimit, "cannot mint over sale limit");
        uint256 price = getAuctionPrice(_saleStartTime);

        uint256 totalCost = (price - getDiscountPrice(price, lockUntil)) * quantity;
        _safeMint(msg.sender, quantity);
        refundIfOver(totalCost);
    }

    function allowlistMint(uint256 quantity, uint256 lockUntil) external payable callerIsUser {
        uint256 price = uint256(saleConfig.mintlistPrice);
        uint256 startTime = uint256(saleConfig.mintlistStartTime);
        uint256 saleLimit = uint256(saleConfig.saleLimit);

        require(
            saleLimit != 0 && price != 0 && startTime != 0 && block.timestamp > startTime,
            "allowlist sale has not begun yet"
        );
        require(allowlist[msg.sender] > 0, "not eligible for allowlist mint");
        require(numberMinted(msg.sender) + quantity <= maxPerAddressDuringMint, "can not mint this many");
        require(totalSupply() + quantity <= collectionSize, "reached max supply");
        require(totalSupply() + quantity <= saleLimit, "can not mint over sale limit");

        uint256 totalCost = (price - getDiscountPrice(price, lockUntil)) * quantity;

        _safeMint(msg.sender, quantity);
        refundIfOver(totalCost);

        allowlist[msg.sender] -= quantity;
    }

    function publicSaleMint(
        uint256 quantity,
        uint256 lockUntil,
        uint256 callerPublicSaleKey
    ) external payable callerIsUser {
        SaleConfig memory config = saleConfig;
        uint256 publicSaleKey_ = uint256(publicSaleKey);
        uint256 publicPrice = uint256(config.publicPrice);
        uint256 publicSaleStartTime = uint256(config.publicSaleStartTime);
        uint256 saleLimit = uint256(config.saleLimit);
        require(publicSaleKey_ == callerPublicSaleKey, "called with incorrect public sale key");
        require(
            isPublicSaleOn(publicPrice, publicSaleKey_, publicSaleStartTime, saleLimit),
            "public sale has not begun yet"
        );
        require(totalSupply() + quantity <= collectionSize, "reached max supply");
        require(numberMinted(msg.sender) + quantity <= maxPerAddressDuringMint, "can not mint this many");
        require(totalSupply() + quantity <= saleLimit, "can not mint over sale limit");

        uint256 totalCost = (publicPrice - getDiscountPrice(publicPrice, lockUntil)) * quantity;

        _safeMint(msg.sender, quantity);
        refundIfOver(totalCost);
    }

    function refundIfOver(uint256 price) private {
        require(msg.value >= price, "Need to send more ETH.");
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
    }

    function isPublicSaleOn(
        uint256 publicPriceWei,
        uint256 publicSaleKey_,
        uint256 publicSaleStartTime,
        uint256 saleLimit
    ) public view returns (bool) {
        return
            publicPriceWei != 0 &&
            publicSaleKey_ != 0 &&
            saleLimit != 0 &&
            publicSaleStartTime != 0 &&
            block.timestamp >= publicSaleStartTime;
    }

    // 1 month is defined as 30 days. Because leap seconds cannot be computed in Solidity.

    uint32 ONE_MONTH = 30 days;

    function getDiscountPrice(uint256 price, uint256 lockUntil) public view returns (uint256) {
        if (lockUntil == 0 || saleConfig.discountList.length <= 1) return 0;
        uint32 DISCOUNT_INTERVAL = ONE_MONTH * saleConfig.discountInterval;
        uint32 i = saleConfig.discountInterval;

        unchecked {
            do {
                i--;
                require(i > 0, "does not match discountList and lockUntil");
                uint32 monthInterval = ONE_MONTH * (saleConfig.discountInterval * i);

                if (
                    lockUntil == block.timestamp + monthInterval ||
                    (lockUntil < block.timestamp + monthInterval + 1 days &&
                        lockUntil > block.timestamp + monthInterval - 1 days)
                ) break;
            } while (i > 0);
        }

        uint32[] memory _discountList = saleConfig.discountList;
        uint32 discountIndex = uint32((lockUntil - block.timestamp) / DISCOUNT_INTERVAL);
        require(discountIndex <= _discountList.length, "can not over discountlist length");
        return (price * _discountList[discountIndex]) / 100;
    }

    function getAuctionPrice(uint256 _saleStartTime) public view returns (uint256) {
        if (block.timestamp < _saleStartTime) {
            return saleConfig.auctionSaleStartPrice;
        }
        if (block.timestamp - _saleStartTime >= saleConfig.auctionSaleDropCurve) {
            return saleConfig.auctionSaleEndPrice;
        } else {
            uint256 steps = (block.timestamp - _saleStartTime) / saleConfig.auctionSaleDropInterval;
            uint256 dropPerStep = (saleConfig.auctionSaleStartPrice - saleConfig.auctionSaleEndPrice) /
                (saleConfig.auctionSaleDropCurve / saleConfig.auctionSaleDropInterval);

            return saleConfig.auctionSaleStartPrice - (steps * dropPerStep);
        }
    }

    function setAuctionSaleOptions(
        uint32 timestamp,
        uint256 startPrice,
        uint256 endPrice,
        uint32 saleLimit,
        uint32 dropCurve,
        uint32 dropInterval
    ) external onlyOwner {
        saleConfig.auctionSaleStartTime = timestamp;
        saleConfig.auctionSaleStartPrice = startPrice;
        saleConfig.auctionSaleEndPrice = endPrice;
        saleConfig.auctionSaleLimit = saleLimit;
        saleConfig.auctionSaleDropCurve = (dropCurve * 1 minutes);
        saleConfig.auctionSaleDropInterval = (dropInterval * 1 minutes);
    }

    function endAuctionAndSetupNonAuctionSaleInfo(
        uint256 mintlistPriceWei,
        uint256 publicPriceWei,
        uint32 mintlistStartTime,
        uint32 publicSaleStartTime
    ) external onlyOwner {
        saleConfig.auctionSaleStartTime = 0;
        saleConfig.auctionSaleStartPrice = 0;
        saleConfig.auctionSaleEndPrice = 0;
        saleConfig.publicPrice = publicPriceWei;
        saleConfig.mintlistPrice = mintlistPriceWei;
        saleConfig.mintlistStartTime = mintlistStartTime;
        saleConfig.publicSaleStartTime = publicSaleStartTime;
    }

    function endAuctionAndSetupMintlistSaleInfo(uint256 mintlistPriceWei, uint32 mintlistStartTime) external onlyOwner {
        saleConfig.auctionSaleStartTime = 0;
        saleConfig.auctionSaleStartPrice = 0;
        saleConfig.auctionSaleEndPrice = 0;
        saleConfig.mintlistPrice = mintlistPriceWei;
        saleConfig.mintlistStartTime = mintlistStartTime;
    }

    function endMintlistAndSetupPublicSaleInfo(uint256 publicPriceWei, uint32 publicSaleStartTime) external onlyOwner {
        saleConfig.mintlistPrice = 0;
        saleConfig.mintlistStartTime = 0;
        saleConfig.publicPrice = publicPriceWei;
        saleConfig.publicSaleStartTime = publicSaleStartTime;
    }

    function endSale() external onlyOwner {
        saleConfig.auctionSaleStartPrice = 0;
        saleConfig.auctionSaleStartTime = 0;
        saleConfig.mintlistPrice = 0;
        saleConfig.mintlistStartTime = 0;
        saleConfig.publicPrice = 0;
        saleConfig.publicSaleStartTime = 0;
    }

    function setSaleLimit(uint32 saleLimit) external onlyOwner {
        saleConfig.saleLimit = saleLimit;
    }

    uint32 ONE_YEAR_PER_MONTH = 12;

    function setDiscountlist(uint32[] memory discountList) external onlyOwner {
        require(discountList.length < ONE_YEAR_PER_MONTH, "can not over one year");
        saleConfig.discountInterval = uint32(ONE_YEAR_PER_MONTH / discountList.length);
        saleConfig.discountList = discountList;
    }

    function setPublicSaleKey(uint32 key) external onlyOwner {
        publicSaleKey = key;
    }

    function seedAllowlist(address[] memory addresses, uint256[] memory numSlots) external onlyOwner {
        require(addresses.length == numSlots.length, "addresses does not match numSlots length");
        for (uint256 i = 0; i < addresses.length; i++) {
            allowlist[addresses[i]] = numSlots[i];
            allowers.push(addresses[i]);
        }
    }

    function clearAllowlist() external onlyOwner {
        for (uint256 i = 0; i < allowers.length; i++) {
            delete allowlist[allowers[i]];
        }
        allowers = new address[](0);
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

    // function setOwnersExplicit(uint256 quantity) external onlyOwner nonReentrant {
    //     _setOwnersExplicit(quantity);
    // }

    function getRevealLimit() public view onlyOwner returns (uint256) {
        return _revealLimit;
    }

    function numberMinted(address owner) public view returns (uint256) {
        return _numberMinted(owner);
    }

    function getOwnershipData(uint256 tokenId) external view returns (TokenOwnership memory) {
        return _ownershipOf(tokenId);
    }

    function getOwnershipDatas(uint256[] memory tokenIds) external view returns (TokenOwnership[] memory) {
        TokenOwnership[] memory ownerships = new TokenOwnership[](tokenIds.length);
        unchecked {
            for (uint256 i = 0; i < tokenIds.length; i++) {
                ownerships[i] = _ownershipOf(tokenIds[i]);
            }
        }
        return ownerships;
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
