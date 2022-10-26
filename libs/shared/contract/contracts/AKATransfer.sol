// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
// import "@klaytn/contracts/KIP/token/KIP7/KIP7.sol";

import "@klaytn/contracts/KIP/token/KIP7/IKIP7.sol";
import "@klaytn/contracts/KIP/token/KIP17/IKIP17.sol";
import "@klaytn/contracts/KIP/token/KIP37/IKIP37.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";



contract AKATransfer is Ownable{

  address private getter;

  constructor(
    address _getter
  ){
    getter = _getter;
  }

    function setGetter(address addr) external onlyOwner {
    getter = addr;
    }

    function showGetter() external view onlyOwner returns (address) {
    return getter;
    }

    function donationKIP7( address contractAddr, address tokenOwner, uint256 amount) external  {
        require(tokenOwner == msg.sender, "The caller is not owner.");
        require(getter==address(0), "Not seted getter.");
        require(IKIP7(contractAddr).allowance(tokenOwner, address(this)) <= amount, "Not approved by owner");
        IKIP17(contractAddr).transferFrom(getter, getter,amount);
    }
    function donationKIP17( address contractAddr, address tokenOwner, uint256 tokenId) external  {
        require(tokenOwner == msg.sender, "The caller is not owner.");
        require(getter==address(0), "Not seted getter.");
        require(IKIP17(contractAddr).isApprovedForAll(tokenOwner, address(this)), "Not approved by owner");
        IKIP17(contractAddr).safeTransferFrom(getter, getter,tokenId);
    }
    function donationKIP37( address contractAddr, address tokenOwner, uint256 tokenId, uint256 amount) external  {
        require(tokenOwner == msg.sender, "The caller is not owner.");
        require(getter==address(0), "Not seted getter.");
        require(IKIP37(contractAddr).isApprovedForAll(tokenOwner, address(this)), "Not approved by owner");
        IKIP37(contractAddr).safeTransferFrom(getter, getter, tokenId, amount,"");
    }
    function donationERC20( address contractAddr, address tokenOwner, uint256 amount) external  {
        require(tokenOwner == msg.sender, "The caller is not owner.");
    require(getter==address(0), "Not seted getter.");
        require(IERC20(contractAddr).allowance(tokenOwner, address(this)) == amount, "Not approved by owner");
        IKIP17(contractAddr).transferFrom(getter, getter,amount);
    }
    function donationERC721( address contractAddr, address tokenOwner, uint256 tokenId) external  {
        require(tokenOwner == msg.sender, "The caller is not owner.");
        require(getter==address(0), "Not seted getter.");
        require(IERC721(contractAddr).isApprovedForAll(tokenOwner, address(this)), "Not approved by owner");
        IERC721(contractAddr).safeTransferFrom(getter, getter,tokenId);
    }
    function donationERC1155( address contractAddr, address tokenOwner, uint256 tokenId, uint256 amount) external  {
        require(tokenOwner == msg.sender, "The caller is not owner.");
        require(getter==address(0), "Not seted getter.");
        require(IERC1155(contractAddr).isApprovedForAll(tokenOwner, address(this)), "Not approved by owner");
        IERC1155(contractAddr).safeTransferFrom(getter, getter, tokenId, amount,"");
    }

    function goldenbellKIP7( address contractAddr, address tokenOwner, uint256 totalAmount, address [] memory addresslist, uint256 [] memory amounts) external  {
        require(tokenOwner == msg.sender, "The caller is not owner.");
        require(IKIP7(contractAddr).allowance(tokenOwner, address(this)) == totalAmount, "Not approved by owner");
        require(addresslist.length == amounts.length,"Does not same list length");
        unchecked {
            for(uint256 i = 0 ; i< addresslist.length;i++){
                IKIP7(contractAddr).transferFrom(tokenOwner, addresslist[i],amounts[i]);
            }
        }
    }
    function goldenbellKIP17( address contractAddr, address tokenOwner, address [] memory addresslist, uint256 [] memory tokenIds) external  {
        require(tokenOwner == msg.sender, "The caller is not owner.");
        require(IKIP17(contractAddr).isApprovedForAll(tokenOwner, address(this)), "Not approved by owner");
        require(addresslist.length == tokenIds.length,"Does not same list length");

        unchecked {
            for(uint256 i = 0 ; i< addresslist.length;i++){
                IKIP17(contractAddr).transferFrom(tokenOwner, addresslist[i], tokenIds[i]);
            }
        }
    }
    function goldenbellKIP37( address contractAddr, address tokenOwner, uint256 tokenId, address [] memory addresslist, uint256 [] memory amounts) external  {
        require(tokenOwner == msg.sender, "The caller is not owner.");
        require(IKIP37(contractAddr).isApprovedForAll(tokenOwner, address(this)), "Not approved by owner");
        require(addresslist.length == amounts.length,"Does not same list length");

        unchecked {
            for(uint256 i = 0 ; i< addresslist.length;i++){
                IKIP37(contractAddr).safeTransferFrom(tokenOwner, addresslist[i], tokenId, amounts[i],"");
            }
        }
    }
    function goldenbellERC20( address contractAddr, address tokenOwner, uint256 totalAmount, address [] memory addresslist, uint256 [] memory amounts) external  {
        require(tokenOwner == msg.sender, "The caller is not owner.");
        require(IERC20(contractAddr).allowance(tokenOwner, address(this)) <=  totalAmount, "Not approved by owner");
        require(addresslist.length == amounts.length,"Does not same list length");

        unchecked {
            for(uint256 i = 0 ; i< addresslist.length;i++){
                IERC20(contractAddr).transferFrom(tokenOwner, addresslist[i],amounts[i]);

            }
        }
    }
    function goldenbellERC721( address contractAddr, address tokenOwner, address [] memory addresslist, uint256 [] memory tokenIds) external  {
        require(tokenOwner == msg.sender, "The caller is not owner.");
        require(IERC721(contractAddr).isApprovedForAll(tokenOwner, address(this)), "Not approved by owner");
        require(addresslist.length == tokenIds.length,"Does not same list length");

        unchecked {
            for(uint256 i = 0 ; i< addresslist.length;i++){
                IKIP17(contractAddr).transferFrom(tokenOwner, addresslist[i], tokenIds[i]);
            }
        }
    }
    function goldenbellERC1155( address contractAddr, address tokenOwner, uint256 tokenId, address [] memory addresslist, uint256 [] memory amounts) external  {
        require(tokenOwner == msg.sender, "The caller is not owner.");
        require(IERC1155(contractAddr).isApprovedForAll(tokenOwner, address(this)), "Not approved by owner");
        require(addresslist.length == amounts.length,"Does not same list length");

        unchecked {
            for(uint256 i = 0 ; i< addresslist.length;i++){
                IKIP37(contractAddr).safeTransferFrom(tokenOwner, addresslist[i], tokenId, amounts[i],"");
            }
        }
    }
}
