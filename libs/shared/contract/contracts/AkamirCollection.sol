// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract FERC1155 is ERC1155, Ownable {
    constructor() ERC1155("") {}
    // function setUri(uint256 id) internal override{

    // }
}

contract Collection is FERC1155, ReentrancyGuard {
    using Address for address;
    using Strings for uint256;

    string public name;
    string public symbol;
    uint256 public count = 0;

    struct CollectionConfig {
        uint256 price;
        uint256 amount;
        uint256 totalSupply;
        uint256 saleStartTime;
        uint256 fund;
        string uri;
    }

    mapping(uint256 => CollectionConfig) public collections;

    constructor() {}

    modifier callerIsUser() {
        require(tx.origin == msg.sender, "The caller is another contract");
        _;
    }

    function addCollection(
        uint256 price,
        uint256 amount,
        uint256 saleStartTime,
        string memory uri
    ) external onlyOwner {
        unchecked {
            collections[count].price = price;
            collections[count].amount = amount;
            collections[count].saleStartTime = saleStartTime;
            collections[count].totalSupply = 0;
            collections[count].uri = uri;
        }
        count += 1;
    }

    function setCollection(
        uint256 id,
        uint256 price,
        uint256 amount,
        uint256 saleStartTime,
        string memory uri
    ) external onlyOwner {
        unchecked {
            collections[id].price = price;
            collections[id].amount = amount;
            collections[id].saleStartTime = saleStartTime;
            collections[id].uri = uri;
        }
    }

    function setPrice(uint256 id, uint256 price) external onlyOwner {
        unchecked {
            collections[id].price = price;
        }
    }

    function setSaleStartTime(uint256 id, uint256 saleStartTime) external onlyOwner {
        unchecked {
            collections[id].saleStartTime = saleStartTime;
        }
    }

    function setAmount(uint256 id, uint256 amount) external onlyOwner {
        unchecked {
            collections[id].amount = amount;
        }
    }

    function setURI(uint256 id, string memory uri) external onlyOwner {
        unchecked {
            collections[id].uri = uri;
        }
    }

    function mint(uint256 id, uint256 amount) external payable {
        require(isMintReady(id), "mint not ready.");
        require(collections[id].saleStartTime < block.timestamp, "sale has not begun yet.");
        require(collections[id].totalSupply + amount <= collections[id].amount, "cannot mint over than config amount.");
        collections[id].totalSupply += amount;
        _mint(msg.sender, id, amount, "");
        refundIfOver(collections[id].price * amount);
    }

    function mintSelf(uint256 id, uint256 amount) external onlyOwner {
        // require(isMintReady(id),"mint not ready.");
        // require(collections[id].saleStartTime < block.timestamp, "sale has not begun yet.");
        require(collections[id].totalSupply + amount <= collections[id].amount, "cannot mint over than config amount.");
        collections[id].totalSupply += amount;
        _mint(msg.sender, id, amount, "");
        // refundIfOver(collections[id].price * amount);
    }

    function airDrop(
        uint256 id,
        address[] memory dropList,
        uint256[] memory amounts
    ) external onlyOwner {
        // require(isMintReady(id),"mint not ready.");
        // require(collections[id].saleStartTime < block.timestamp, "sale has not begun yet.");
        require(dropList.length == amounts.length, "does not match length");
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) totalAmount += amounts[i];
        require(
            collections[id].totalSupply + totalAmount <= collections[id].amount,
            "cannot mint over than config amount."
        );
        for (uint256 i = 0; i < amounts.length; i++) {
            _mint(dropList[i], id, amounts[i], "");
            collections[id].totalSupply += amounts[i];
        }

        // refundIfOver(collections[id].price * amount);
    }

    function isMintReady(uint256 id) internal view returns (bool) {
        return collections[id].price != 0 && collections[id].amount != 0 && collections[id].saleStartTime != 0;
    }

    function mintBatch(uint256[] memory ids, uint256[] memory amounts) external payable {
        require(ids.length == amounts.length, "does not same ids and amounts length");
        uint256 totalPrice = 0;
        unchecked {
            for (uint256 i = 0; i < ids.length; i++) {
                totalPrice += collections[ids[i]].price;
            }
        }
        _mintBatch(msg.sender, ids, amounts, "");
        refundIfOver(totalPrice);
    }

    function tokenURI(uint256 id) public view returns (string memory) {
        return collections[id].uri;
    }

    function uri(uint256 id) public view virtual override returns (string memory) {
        return collections[id].uri;
    }

    function withdrawMoney() external onlyOwner nonReentrant {
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "Transfer failed.");
    }

    function refundIfOver(uint256 price) private {
        require(msg.value >= price, "Need to send more ETH.");
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value);
        }
    }
}
