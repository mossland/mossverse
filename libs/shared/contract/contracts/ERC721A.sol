// SPDX-License-Identifier: MIT
// Creator: Chiru Labs

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

error ApprovalCallerNotOwnerNorApproved();
error ApprovalQueryForNonexistentToken();
error ApproveToCaller();
error ApprovalToCurrentOwner();
error BalanceQueryForZeroAddress();
error MintedQueryForZeroAddress();
error BurnedQueryForZeroAddress();
error AuxQueryForZeroAddress();
error MintToZeroAddress();
error MintZeroQuantity();
error OwnerIndexOutOfBounds();
error OwnerQueryForNonexistentToken();
error TokenIndexOutOfBounds();
error TransferCallerNotOwnerNorApproved();
error TransferFromIncorrectOwner();
error TransferToNonERC721ReceiverImplementer();
error TransferToZeroAddress();
error URIQueryForNonexistentToken();
error TransferLockedToken();
error ApproveLockedToken();
error TokenAlreadyLocked();
error LockCallerNotOwnerNorApproved();
error LockUntilZero();
error LockNotUpperThanTwoYear();
error LockUntilMustBeUpperThanCurrentValue();

/**
 * @dev Implementation of https://eips.ethereum.org/EIPS/eip-721[ERC721] Non-Fungible Token Standard, including
 * the Metadata extension. Built to optimize for lower gas during batch mints.
 *
 * Assumes serials are sequentially minted starting at 0 (e.g. 0, 1, 2, 3..).
 *
 * Assumes that an owner cannot have more than 2**64 - 1 (max value of uint64) of supply.
 *
 * Assumes that the maximum token id cannot exceed 2**256 - 1 (max value of uint256).
 */
contract ERC721A is Context, ERC165, IERC721, IERC721Metadata, IERC721Enumerable {
  using Address for address;
  using Strings for uint256;

  // Compiler will pack this into a single 256bit word.
  struct TokenOwnership {
    // The address of the owner.
    address addr;
    // Keeps track of the start time of ownership with minimal overhead for tokenomics.
    uint64 startTimestamp;
    // Add lock option for blocking transfers.
    uint64 lockUntil;
    // The number of the published token.
    uint64 tokenIndex;
    // Whether the token has been burned.
    bool burned;
  }

  // Compiler will pack this into a single 256bit word.
  struct AddressData {
    // Realistically, 2**64-1 is more than enough.
    uint64 balance;
    // Keeps track of mint count with minimal overhead for tokenomics.
    uint64 numberMinted;
    // Keeps track of burn count with minimal overhead for tokenomics.
    uint64 numberBurned;
    // For miscellaneous variable(s) pertaining to the address
    // (e.g. number of whitelist mint slots used).
    // If there are multiple variables, please pack them into a uint64.
    uint64 aux;
  }

  // The tokenId of the next token to be minted.
  uint256 internal _currentIndex;

  // The number of tokens burned.
  uint256 internal _burnCounter;

  // Token name
  string private _name;

  // Token symbol
  string private _symbol;

  // Mapping from token ID to ownership details
  // An empty struct value does not necessarily mean the token is unowned. See ownershipOf implementation for details.
  mapping(uint256 => TokenOwnership) internal _ownerships;

  mapping(uint256 => uint64) private _lockUntil;

  // Mapping owner address to address data
  mapping(address => AddressData) private _addressData;

  // Mapping from token ID to approved address
  mapping(uint256 => address) private _tokenApprovals;

  // Mapping from owner to operator approvals
  mapping(address => mapping(address => bool)) private _operatorApprovals;

  constructor(string memory name_, string memory symbol_) {
    _name = name_;
    _symbol = symbol_;
  }

  /**
   * @dev See {IERC721Enumerable-totalSupply}.
   */
  function totalSupply() public view override returns (uint256) {
    // Counter underflow is impossible as _burnCounter cannot be incremented
    // more than _currentIndex times
    unchecked {
      return _currentIndex - _burnCounter;
    }
  }

  /**
   * @dev See {IERC721Enumerable-tokenByIndex}.
   */
  function tokenByIndex(uint256 index) public view override returns (uint256) {
    require(index < totalSupply(), "ERC721A: global index out of bounds");
    return index;
  }

  /**
   * @dev See {IERC721Enumerable-tokenOfOwnerByIndex}.
   * This read function is O(collectionSize). If calling from a separate contract, be sure to test gas first.
   * It may also degrade with extremely large collection sizes (e.g >> 10000), test for your use case.
   */
  function tokenOfOwnerByIndex(address owner, uint256 index) public view override returns (uint256) {
    require(index < balanceOf(owner), "ERC721A: owner index out of bounds");
    uint256 numMintedSoFar = totalSupply();
    uint256 tokenIdsIdx = 0;
    address currOwnershipAddr = address(0);
    unchecked {
      for (uint256 i = 0; i < numMintedSoFar; i++) {
        TokenOwnership memory ownership = _ownerships[i];
        if (ownership.addr != address(0)) {
          currOwnershipAddr = ownership.addr;
        }
        if (currOwnershipAddr == owner) {
          if (tokenIdsIdx == index) {
            return i;
          }
          tokenIdsIdx++;
        }
      }
    }
    revert("ERC721A: unable to get token of owner by index");
  }

  function tokensOfOwner(address owner) public view returns (TokenOwnership[] memory) {
    require(balanceOf(owner) != 0, "ERC721A: unable to get token of owner");
    require(owner != address(0), "ERC721A: adress is zero");
    uint256 numMintedSoFar = totalSupply();
    uint256 idsIndex = 0;
    uint256 tokenNum = balanceOf(owner);
    TokenOwnership[] memory tokenOwnerships = new TokenOwnership[](tokenNum);

    unchecked {
      TokenOwnership memory prevOwnership;
      for (uint256 i = 0; i < numMintedSoFar; i++) {
        if (tokenNum == idsIndex) break;
        TokenOwnership memory ownership = _ownerships[i];
        if (ownership.addr == owner) {
          ownership.lockUntil = _lockUntil[i];
          ownership.tokenIndex = uint64(i);
          tokenOwnerships[idsIndex] = ownership;
          idsIndex++;
          prevOwnership = ownership;
        } else if (ownership.addr != address(0) && ownership.addr != owner) prevOwnership = ownership;
        else if (ownership.addr == address(0) && prevOwnership.addr == owner) {
          tokenOwnerships[idsIndex].addr = prevOwnership.addr;
          tokenOwnerships[idsIndex].startTimestamp = prevOwnership.startTimestamp;
          tokenOwnerships[idsIndex].lockUntil = _lockUntil[i];
          tokenOwnerships[idsIndex].tokenIndex = uint64(i);
          tokenOwnerships[idsIndex].burned = prevOwnership.burned;
          idsIndex++;
        }
      }
    }
    return tokenOwnerships;
  }

  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
    return
      interfaceId == type(IERC721).interfaceId ||
      interfaceId == type(IERC721Metadata).interfaceId ||
      super.supportsInterface(interfaceId);
  }

  /**
   * @dev See {IERC721-balanceOf}.
   */
  function balanceOf(address owner) public view override returns (uint256) {
    if (owner == address(0)) revert BalanceQueryForZeroAddress();
    return uint256(_addressData[owner].balance);
  }

  /**
   * Returns the number of tokens minted by `owner`.
   */
  function _numberMinted(address owner) internal view returns (uint256) {
    if (owner == address(0)) revert MintedQueryForZeroAddress();
    return uint256(_addressData[owner].numberMinted);
  }

  /**
   * Returns the number of tokens burned by or on behalf of `owner`.
   */
  function _numberBurned(address owner) internal view returns (uint256) {
    if (owner == address(0)) revert BurnedQueryForZeroAddress();
    return uint256(_addressData[owner].numberBurned);
  }

  /**
   * Returns the auxillary data for `owner`. (e.g. number of whitelist mint slots used).
   */
  function _getAux(address owner) internal view returns (uint64) {
    if (owner == address(0)) revert AuxQueryForZeroAddress();
    return _addressData[owner].aux;
  }

  /**
   * Sets the auxillary data for `owner`. (e.g. number of whitelist mint slots used).
   * If there are multiple variables, please pack them into a uint64.
   */
  function _setAux(address owner, uint64 aux) internal {
    if (owner == address(0)) revert AuxQueryForZeroAddress();
    _addressData[owner].aux = aux;
  }

  /**
   * Gas spent here starts off proportional to the maximum mint batch size.
   * It gradually moves to O(1) as tokens get transferred around in the collection over time.
   */
  function ownershipOf(uint256 tokenId) internal view returns (TokenOwnership memory) {
    uint256 curr = tokenId;

    unchecked {
      if (curr < _currentIndex) {
        TokenOwnership memory ownership = _ownerships[curr];
        if (!ownership.burned) {
          if (ownership.addr != address(0)) {
            ownership.lockUntil = _lockUntil[tokenId];
            ownership.tokenIndex = uint64(tokenId);
            return ownership;
          }
          // Invariant:
          // There will always be an ownership that has an address and is not burned
          // before an ownership that does not have an address and is not burned.
          // Hence, curr will not underflow.
          while (true) {
            curr--;
            ownership = _ownerships[curr];
            if (ownership.addr != address(0)) {
              ownership.lockUntil = _lockUntil[tokenId];
              ownership.tokenIndex = uint64(tokenId);
              return ownership;
            }
          }
        }
      }
    }
    revert OwnerQueryForNonexistentToken();
  }

  /**
   * @dev See {IERC721-ownerOf}.
   */
  function ownerOf(uint256 tokenId) public view override returns (address) {
    return ownershipOf(tokenId).addr;
  }

  /**
   * @dev See {IERC721Metadata-name}.
   */
  function name() public view virtual override returns (string memory) {
    return _name;
  }

  /**
   * @dev See {IERC721Metadata-symbol}.
   */
  function symbol() public view virtual override returns (string memory) {
    return _symbol;
  }

  /**
   * @dev See {IERC721Metadata-tokenURI}.
   */
  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    if (!_exists(tokenId)) revert URIQueryForNonexistentToken();

    string memory baseURI = _baseURI();
    return bytes(baseURI).length != 0 ? string(abi.encodePacked(baseURI, tokenId.toString())) : "";
  }

  /**
   * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
   * token will be the concatenation of the `baseURI` and the `tokenId`. Empty
   * by default, can be overriden in child contracts.
   */
  function _baseURI() internal view virtual returns (string memory) {
    return "";
  }

  /**
   * @dev See {IERC721-approve}.
   */

  function approve(address to, uint256 tokenId) public override {
    address owner = ERC721A.ownerOf(tokenId);

    if (_lockUntil[tokenId] > block.timestamp) revert ApproveLockedToken();
    if (to == owner) revert ApprovalToCurrentOwner();

    if (_msgSender() != owner && !isApprovedForAll(owner, _msgSender())) {
      revert ApprovalCallerNotOwnerNorApproved();
    }

    _approve(to, tokenId, owner);
  }

  /**
   * @dev See {IERC721-getApproved}.
   */
  function getApproved(uint256 tokenId) public view override returns (address) {
    if (!_exists(tokenId)) revert ApprovalQueryForNonexistentToken();

    return _tokenApprovals[tokenId];
  }

  /**
   * @dev See {IERC721-setApprovalForAll}.
   */
  function setApprovalForAll(address operator, bool approved) public override {
    if (operator == _msgSender()) revert ApproveToCaller();

    _operatorApprovals[_msgSender()][operator] = approved;
    emit ApprovalForAll(_msgSender(), operator, approved);
  }

  /**
   * @dev See {IERC721-isApprovedForAll}.
   */
  function isApprovedForAll(address owner, address operator) public view virtual override returns (bool) {
    return _operatorApprovals[owner][operator];
  }

  /**
   * @dev See {IERC721-transferFrom}.
   */
  function transferFrom(
    address from,
    address to,
    uint256 tokenId
  ) public virtual override {
    _transfer(from, to, tokenId);
  }

  /**
   * @dev See {IERC721-safeTransferFrom}.
   */
  function safeTransferFrom(
    address from,
    address to,
    uint256 tokenId
  ) public virtual override {
    safeTransferFrom(from, to, tokenId, "");
  }

  /**
   * @dev See {IERC721-safeTransferFrom}.
   */
  function safeTransferFrom(
    address from,
    address to,
    uint256 tokenId,
    bytes memory _data
  ) public virtual override {
    _transfer(from, to, tokenId);
    if (!_checkOnERC721Received(from, to, tokenId, _data)) {
      revert TransferToNonERC721ReceiverImplementer();
    }
  }

  /**
   * @dev Returns whether `tokenId` exists.
   *
   * Tokens can be managed by their owner or approved accounts via {approve} or {setApprovalForAll}.
   *
   * Tokens start existing when they are minted (`_mint`),
   */
  function _exists(uint256 tokenId) internal view returns (bool) {
    return tokenId < _currentIndex && !_ownerships[tokenId].burned;
  }

  function _safeMint(
    address to,
    uint256 quantity,
    uint256 lockUntil
  ) internal {
    _safeMint(to, quantity, lockUntil, "");
  }

  /**
   * @dev Safely mints `quantity` tokens and transfers them to `to`.
   *
   * Requirements:
   *
   * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called for each safe transfer.
   * - `quantity` must be greater than 0.
   *
   * Emits a {Transfer} event.
   */
  function _safeMint(
    address to,
    uint256 quantity,
    uint256 lockUntil,
    bytes memory _data
  ) internal {
    _mint(to, quantity, lockUntil, _data, true);
  }

  /**
   * @dev Mints `quantity` tokens and transfers them to `to`.
   *
   * Requirements:
   *
   * - `to` cannot be the zero address.
   * - `quantity` must be greater than 0.
   *
   * Emits a {Transfer} event.
   */
  function _mint(
    address to,
    uint256 quantity,
    uint256 lockUntil,
    bytes memory _data,
    bool safe
  ) internal {
    uint256 startTokenId = _currentIndex;
    if (to == address(0)) revert MintToZeroAddress();
    if (quantity == 0) revert MintZeroQuantity();

    // _beforeTokenTransfers(address(0), to, startTokenId, quantity);

    // Overflows are incredibly unrealistic.
    // balance or numberMinted overflow if current value of either + quantity > 1.8e19 (2**64) - 1
    // updatedIndex overflows if _currentIndex + quantity > 1.2e77 (2**256) - 1

    unchecked {
      uint256 updatedIndex = startTokenId;
      _addressData[to].balance += uint64(quantity);
      _addressData[to].numberMinted += uint64(quantity);
      _ownerships[startTokenId].addr = to;
      _ownerships[startTokenId].startTimestamp = uint64(block.timestamp);
      for (uint256 i; i < quantity; i++) {
        _lockUntil[updatedIndex] = uint64(lockUntil);
        emit Transfer(address(0), to, updatedIndex);
        if (safe && !_checkOnERC721Received(address(0), to, updatedIndex, _data)) {
          revert TransferToNonERC721ReceiverImplementer();
        }
        updatedIndex++;
      }
      _currentIndex = updatedIndex;
    }
  }

  uint256 TWO_YEAR = 2 * 365 days;

  function lockTransferFrom(
  address from,
    address to,
    uint256 tokenId,
    uint256 lockUntil
  ) public virtual {
    lockTransferFrom(from, to, tokenId, lockUntil, "");
  }

  function lockTransferFromMany(
    address from,
    address to,
    uint256[] memory tokenIds,
    uint256 lockUntil
  ) public virtual {
    // Underflow of the sender's balance is impossible because we check for
    // ownership above and the recipient's balance can't realistically overflow.
    // Counter overflow is incredibly unrealistic as tokenId would have to be 2**256.
    lockTransferFromMany(from, to, tokenIds, lockUntil, "");
  }

  /**
   * @dev See {IERC721-safeTransferFrom}.
   */
  function lockTransferFrom(
    address from,
    address to,
    uint256 tokenId,
    uint256 lockUntil,
    bytes memory _data
  ) public virtual {
    _lockTransfer(from, to, tokenId, lockUntil);
    if (!_checkOnERC721Received(from, to, tokenId, _data)) {
      revert TransferToNonERC721ReceiverImplementer();
    }
  }

  function lockTransferFromMany(
    address from,
    address to,
    uint256[] memory tokenIds,
    uint256 lockUntil,
    bytes memory _data
  ) public virtual {
    for (uint64 i; i < tokenIds.length; i++) {
      _lockTransfer(from, to, tokenIds[i], lockUntil);
      if (!_checkOnERC721Received(from, to, tokenIds[i], _data)) {
        revert TransferToNonERC721ReceiverImplementer();
      }
    }
  }

  function lock(uint256 tokenId, uint256 lockUntil) public {
    TokenOwnership memory ownership = ownershipOf(tokenId);
    bool isApprovedOrOwner = (_msgSender() == ownership.addr ||
      isApprovedForAll(ownership.addr, _msgSender()) ||
      getApproved(tokenId) == _msgSender());
    if (lockUntil == 0) revert LockUntilZero();
    if (!isApprovedOrOwner) revert LockCallerNotOwnerNorApproved();
    if (lockUntil - block.timestamp >= TWO_YEAR) revert LockNotUpperThanTwoYear();
    if (_lockUntil[tokenId] != 0 && lockUntil <= _lockUntil[tokenId]) revert LockUntilMustBeUpperThanCurrentValue();
    if (_lockUntil[tokenId] != 0 && block.timestamp < _lockUntil[tokenId]){
     if(lockUntil - _lockUntil[tokenId] >= TWO_YEAR) revert LockNotUpperThanTwoYear();
     }
    _lock(tokenId, lockUntil);
  }

  function locks(uint256[] memory tokenIds, uint256 lockUntil) public {
    if (lockUntil == 0) revert LockUntilZero();
    unchecked {
      for (uint256 i; i < tokenIds.length ; i++) {
        TokenOwnership memory ownership = ownershipOf(tokenIds[i]);
        bool isApprovedOrOwner = (_msgSender() == ownership.addr ||
          isApprovedForAll(ownership.addr, _msgSender()) ||
          getApproved(tokenIds[i]) == _msgSender());
        if (lockUntil - block.timestamp >= TWO_YEAR) revert LockNotUpperThanTwoYear();
        if (!isApprovedOrOwner) revert LockCallerNotOwnerNorApproved();
        if (_lockUntil[tokenIds[i]] != 0 && lockUntil <= _lockUntil[tokenIds[i]])
          revert LockUntilMustBeUpperThanCurrentValue();
        if (_lockUntil[tokenIds[i]] != 0 && block.timestamp < _lockUntil[tokenIds[i]]){
     if(lockUntil - _lockUntil[tokenIds[i]] >= TWO_YEAR) revert LockNotUpperThanTwoYear();
     }
          revert LockNotUpperThanTwoYear();
      }
      _locks(tokenIds, lockUntil);
      // _locks(tokenIds, lockUntil);
    }
  }

  function unlock(uint256 tokenId) internal {
    _unlock(tokenId);
  }

  function _lock(uint256 tokenId, uint256 lockUntil) private {
    _lockUntil[tokenId] = uint64(lockUntil);
  }

  function _locks(uint256[] memory tokenIds, uint256 lockUntil) private {
    unchecked {
      for (uint256 i; i < tokenIds.length; i++) _lockUntil[tokenIds[i]] = uint64(lockUntil);
    }
  }

  function _unlock(uint256 tokenId) private {
    _lockUntil[tokenId] = uint64(0);
  }

  function _lockTransfer(
    address from,
    address to,
    uint256 tokenId,
    uint256 lockUntil
  ) private {
    TokenOwnership memory prevOwnership = ownershipOf(tokenId);

    bool isApprovedOrOwner = (_msgSender() == prevOwnership.addr ||
      isApprovedForAll(prevOwnership.addr, _msgSender()) ||
      getApproved(tokenId) == _msgSender());
    if (lockUntil == 0) revert LockUntilZero();
    if (!isApprovedOrOwner) revert TransferCallerNotOwnerNorApproved();
    if (prevOwnership.addr != from) revert TransferFromIncorrectOwner();
    if (to == address(0)) revert TransferToZeroAddress();
    if (_lockUntil[tokenId] != 0 && block.timestamp <= _lockUntil[tokenId]) revert TransferLockedToken();

    _beforeTokenTransfers(from, to, tokenId, 1);

    // Clear approvals from the previous owner
    _approve(address(0), tokenId, prevOwnership.addr);

    // Underflow of the sender's balance is impossible because we check for
    // ownership above and the recipient's balance can't realistically overflow.
    // Counter overflow is incredibly unrealistic as tokenId would have to be 2**256.
    unchecked {
      _addressData[from].balance -= 1;
      _addressData[to].balance += 1;
      _lockUntil[tokenId] = uint64(lockUntil);
      _ownerships[tokenId].addr = to;
      _ownerships[tokenId].startTimestamp = uint64(block.timestamp);

      // If the ownership slot of tokenId+1 is not explicitly set, that means the transfer initiator owns it.
      // Set the slot of tokenId+1 explicitly in storage to maintain correctness for ownerOf(tokenId+1) calls.
      uint256 nextTokenId = tokenId + 1;
      if (_ownerships[nextTokenId].addr == address(0)) {
        // This will suffice for checking _exists(nextTokenId),
        // as a burned slot cannot contain the zero address.
        if (nextTokenId < _currentIndex) {
          _ownerships[nextTokenId].addr = prevOwnership.addr;
          _ownerships[nextTokenId].startTimestamp = prevOwnership.startTimestamp;
        }
      }
    }

    emit Transfer(from, to, tokenId);
    _afterTokenTransfers(from, to, tokenId, 1);
  }

  /**
   * @dev Transfers `tokenId` from `from` to `to`.
   *
   * Requirements:
   *
   * - `to` cannot be the zero address.
   * - `tokenId` token must be owned by `from`.
   *
   * Emits a {Transfer} event.
   */
  function _transfer(
    address from,
    address to,
    uint256 tokenId
  ) private {
    TokenOwnership memory prevOwnership = ownershipOf(tokenId);

    bool isApprovedOrOwner = (_msgSender() == prevOwnership.addr ||
      isApprovedForAll(prevOwnership.addr, _msgSender()) ||
      getApproved(tokenId) == _msgSender());
    if (!isApprovedOrOwner) revert TransferCallerNotOwnerNorApproved();
    if (prevOwnership.addr != from) revert TransferFromIncorrectOwner();
    if (to == address(0)) revert TransferToZeroAddress();
    if (_lockUntil[tokenId] != 0 && block.timestamp <= _lockUntil[tokenId]) revert TransferLockedToken();

    _beforeTokenTransfers(from, to, tokenId, 1);

    // Clear approvals from the previous owner
    _approve(address(0), tokenId, prevOwnership.addr);

    // Underflow of the sender's balance is impossible because we check for
    // ownership above and the recipient's balance can't realistically overflow.
    // Counter overflow is incredibly unrealistic as tokenId would have to be 2**256.
    unchecked {
      _addressData[from].balance -= 1;
      _addressData[to].balance += 1;

      _ownerships[tokenId].addr = to;
      _ownerships[tokenId].startTimestamp = uint64(block.timestamp);

      // If the ownership slot of tokenId+1 is not explicitly set, that means the transfer initiator owns it.
      // Set the slot of tokenId+1 explicitly in storage to maintain correctness for ownerOf(tokenId+1) calls.
      uint256 nextTokenId = tokenId + 1;
      if (_ownerships[nextTokenId].addr == address(0)) {
        // This will suffice for checking _exists(nextTokenId),
        // as a burned slot cannot contain the zero address.
        if (nextTokenId < _currentIndex) {
          _ownerships[nextTokenId].addr = prevOwnership.addr;
          _ownerships[nextTokenId].startTimestamp = prevOwnership.startTimestamp;
        }
      }
    }

    emit Transfer(from, to, tokenId);
    _afterTokenTransfers(from, to, tokenId, 1);
  }

  /**
   * @dev Approve `to` to operate on `tokenId`
   *
   * Emits a {Approval} event.
   */
  function _approve(
    address to,
    uint256 tokenId,
    address owner
  ) private {
    _tokenApprovals[tokenId] = to;
    emit Approval(owner, to, tokenId);
  }

  /**
   * @dev Internal function to invoke {IERC721Receiver-onERC721Received} on a target address.
   * The call is not executed if the target address is not a contract.
   *
   * @param from address representing the previous owner of the given token ID
   * @param to target address that will receive the tokens
   * @param tokenId uint256 ID of the token to be transferred
   * @param _data bytes optional data to send along with the call
   * @return bool whether the call correctly returned the expected magic value
   */
  function _checkOnERC721Received(
    address from,
    address to,
    uint256 tokenId,
    bytes memory _data
  ) private returns (bool) {
    if (to.isContract()) {
      try IERC721Receiver(to).onERC721Received(_msgSender(), from, tokenId, _data) returns (bytes4 retval) {
        return retval == IERC721Receiver(to).onERC721Received.selector;
      } catch (bytes memory reason) {
        if (reason.length == 0) {
          revert TransferToNonERC721ReceiverImplementer();
        } else {
          assembly {
            revert(add(32, reason), mload(reason))
          }
        }
      }
    } else {
      return true;
    }
  }

  /**
   * @dev Hook that is called before a set of serially-ordered token ids are about to be transferred. This includes minting.
   * And also called before burning one token.
   *
   * startTokenId - the first token id to be transferred
   * quantity - the amount to be transferred
   *
   * Calling conditions:
   *
   * - When `from` and `to` are both non-zero, `from`'s `tokenId` will be
   * transferred to `to`.
   * - When `from` is zero, `tokenId` will be minted for `to`.
   * - When `to` is zero, `tokenId` will be burned by `from`.
   * - `from` and `to` are never both zero.
   */
  function _beforeTokenTransfers(
    address from,
    address to,
    uint256 startTokenId,
    uint256 quantity
  ) internal virtual {}

  /**
   * @dev Hook that is called after a set of serially-ordered token ids have been transferred. This includes
   * minting.
   * And also called after one token has been burned.
   *
   * startTokenId - the first token id to be transferred
   * quantity - the amount to be transferred
   *
   * Calling conditions:
   *
   * - When `from` and `to` are both non-zero, `from`'s `tokenId` has been
   * transferred to `to`.
   * - When `from` is zero, `tokenId` has been minted for `to`.
   * - When `to` is zero, `tokenId` has been burned by `from`.
   * - `from` and `to` are never both zero.
   */
  function _afterTokenTransfers(
    address from,
    address to,
    uint256 startTokenId,
    uint256 quantity
  ) internal virtual {}
}
