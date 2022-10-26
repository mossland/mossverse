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

  

 constructor()ERC1155(""){} 
  // function setUri(uint256 id) internal override{

  // }

 
  
}

contract Fraction is FERC1155, ReentrancyGuard {
  using Address for address;
  using Strings for uint256;

   address public immutable fatherNft;
  string public name;
  string public symbol;
  
  struct FractionConfig {
    bool approval;
    uint256 price;
    uint256 amount;
    uint256 saleStartTime;
    uint256 totalSupply;
    uint256 fund;
    string uri;
  }

  mapping (uint256 => FractionConfig) public fractions;

  // constructor(
   
  // ) {
  //  name = "a";
  //  symbol = "b";
   
  // //  fractions[0].approval = true;
  // //  fractions[0].price = 1000000000000000000;
  // //  fractions[0].amount = 10000;
  // //  fractions[0].saleStartTime = 1653393712;
  // }
  constructor(
    address nft_
  ) {
   fatherNft = nft_;
  }

  modifier callerIsUser() {
    require(tx.origin == msg.sender, "The caller is another contract");
    _;
  }

  function fraction(address owner, uint256 id, uint256 price,uint256 amount, uint256 saleStartTime) external onlyOwner {
    IERC721(fatherNft).transferFrom(owner, address(this), id);
    unchecked {
    fractions[id].approval = true;
      fractions[id].price = price;
      fractions[id].amount = amount;
      fractions[id].saleStartTime = saleStartTime;
      fractions[id].totalSupply = 0;
    }
  }

  function combine(address account, uint256 id) external onlyOwner {
    uint256 amount = balanceOf(account, id);
    require (amount == fractions[id].amount, "Insufficient number of tokens to combine.");
    
    IERC721(fatherNft).safeTransferFrom(address(this), account, id);
       unchecked{
      fractions[id].approval = false;
      fractions[id].price = 0;
      fractions[id].amount = 0;
      fractions[id].saleStartTime = 0;
      fractions[id].totalSupply = 0;
      fractions[id].uri = "";
    }

    _burn(account, id, amount);
  }

  function setFraction(uint256 id, bool approval, uint256 price, uint256 amount, uint256 saleStartTime, string memory uri ) external onlyOwner {
    unchecked{
      fractions[id].approval = approval;
      fractions[id].price = price;
      fractions[id].amount = amount;
      fractions[id].saleStartTime = saleStartTime;
      fractions[id].uri = uri;
    }
  }

  function setApproval(uint256 id, bool approval) external onlyOwner {
    unchecked{
    fractions[id].approval = approval;
    }
  }

  function setPrice(uint256 id, uint256 price) external onlyOwner {
    unchecked{
    fractions[id].price = price;
    }
  }

  function setSaleStartTime(uint256 id, uint256 saleStartTime) external onlyOwner {
    unchecked{
    fractions[id].saleStartTime = saleStartTime;
    }
  }

  function setAmount(uint256 id, uint256 amount ) external onlyOwner {
    unchecked{
    fractions[id].amount = amount;
    }
  }

    function setURI(uint256 id, string memory uri) external onlyOwner {
      fractions[id].uri = uri;
  }


function tokenURI(uint256 id) public view returns (string memory) {
  return fractions[id].uri;
}

function uri(uint256 id) public view override returns (string memory) {
  return fractions[id].uri;
}

  function mint( uint256 id, uint256 amount) external payable{
    require(fractions[id].approval == true, "this token is not approved.");
    require(fractions[id].saleStartTime < block.timestamp, "sale has not begun yet.");
    require(fractions[id].totalSupply + amount <= fractions[id].amount, "cannot mint higher than config amount.");
    fractions[id].totalSupply += amount;
    fractions[id].fund = fractions[id].price * amount;
    _mint(msg.sender,id,amount,"");
    refundIfOver(fractions[id].price * amount);
}


  function mintBatch( uint256[] memory ids, uint256[] memory amounts) external payable{
    require (ids.length == amounts.length,"does not same ids and amounts length");
    uint256 totalPrice = 0;
    unchecked {
      for(uint256 i = 0; i<ids.length ;i++) {
        totalPrice += fractions[ids[i]].price;
      }
    }
  _mintBatch(msg.sender, ids, amounts,"");
  refundIfOver(totalPrice);
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
