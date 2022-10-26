pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AkaMarket is Ownable, AccessControl {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    using Address for address;
    using Strings for uint256;
    uint256 private _erc20Limit = 0;
    uint256 private _erc721Limit = 0;
    uint256 private _erc1155Limit = 0;

    constructor() public {}

    function withdraw() external onlyOwner {
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "Transfer failed.");
    }

    function setLimits(
        uint256 erc20Limit,
        uint256 erc721Limit,
        uint256 erc1155Limit
    ) external onlyOwner {
        _erc20Limit = erc20Limit;
        _erc721Limit = erc721Limit;
        _erc1155Limit = erc1155Limit;
    }

    function transferErc20(
        address contractAddr,
        address from,
        address to,
        uint256 amount
    ) external onlyRole(OPERATOR_ROLE) {
        require(_erc20Limit == 0 || _erc20Limit > 1, "CALL_LIMIT_REACHED");
        ERC20 token = ERC20(contractAddr);
        token.transferFrom(from, to, amount);
        if (_erc20Limit > 1) _erc20Limit = _erc20Limit - 1;
    }

    function transferErc721(
        address contractAddr,
        address from,
        address to,
        uint256 tokenId
    ) external onlyRole(OPERATOR_ROLE) {
        require(_erc721Limit == 0 || _erc721Limit > 1, "CALL_LIMIT_REACHED");
        ERC721 token = ERC721(contractAddr);
        token.safeTransferFrom(from, to, tokenId);
        if (_erc721Limit > 1) _erc721Limit = _erc721Limit - 1;
    }

    function transferErc1155(
        address contractAddr,
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) external onlyRole(OPERATOR_ROLE) {
        require(_erc1155Limit == 0 || _erc1155Limit > 1, "CALL_LIMIT_REACHED");
        ERC1155 token = ERC1155(contractAddr);
        token.safeTransferFrom(from, to, id, amount, data);
        if (_erc1155Limit > 1) _erc1155Limit = _erc1155Limit - 1;
    }

    function addOperators(address[] memory operators) external onlyOwner {
        for (uint256 i = 0; i < operators.length; ++i) {
            _setupRole(OPERATOR_ROLE, operators[i]);
        }
    }

    function removeOperators(address[] memory operators) external onlyOwner {
        for (uint256 i = 0; i < operators.length; ++i) {
            _revokeRole(OPERATOR_ROLE, operators[i]);
        }
    }
}
