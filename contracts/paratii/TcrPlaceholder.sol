pragma solidity ^0.4.18;

import "./ParatiiToken.sol";

/// WARNING , NOT PRODUCTION READY, based on ADCHAIN Registry.
/// THIS IS JUST A PLACEHOLDER..
contract TcrPlaceholder {

  // Events
  // ---------

  event _Application(string videoId, uint deposit);
  event _NewVideoWhitelisted(string videoId);

  struct Listing {
    uint applicationExpiry; // Expiration date of apply stage
    bool whitelisted;       // registration status
    address owner;          // Owner of the video.
    uint unstakedDeposit;   // unlocked tokens
    uint challengeID;       // ID of canonical challenge
  }

  // Maps of videoId Hashes to listing data.
  mapping(bytes32 => Listing) public listings;

  ParatiiToken public token;
  uint public minDeposit;
  uint public applyStageLen;

  // ---------------------------------------------------------------------------
  // CONSTRUCTOR
  // ------------------

  function TcrPlaceholder(
    address _tokenAddr,
    uint _minDeposit,
    uint _applyStageLen
  ) {
    token = ParatiiToken(_tokenAddr);
    minDeposit = _minDeposit;
    applyStageLen = _applyStageLen; // 100 blocks.
  }

  // ---------------------------------------------------------------------------
  // Video creator functions
  //------------------------

  /**
   * allow video creator to apply for whitelisting for a video.
   * @param  _videoId  the videoId
   * @param  _amount   the amount to Stake
   */
  function apply(string _videoId, uint _amount) external {
    require(!isWhitelisted(_videoId));
    require(!appWasMade(_videoId));
    require(_amount >= minDeposit);

    // set owner
    Listing storage listing = listings[keccak256(_videoId)];
    listing.owner = msg.sender;

    // transfer tokens from user to TcrPlaceholder contract
    require(token.transferFrom(listing.owner, this, _amount));

    // sets apply stage and end time.
    listing.applicationExpiry = block.number + applyStageLen;
    listing.unstakedDeposit = _amount;

    _Application(_videoId, _amount);
  }

  /**
   * deposit an amount of tokens. (unstaked)
   * @param  amount the amount to deposit
   * @return {EVENT}      returns event log of deposit event.
   */
  function deposit(uint amount) external {

  }

  /**
   * take out an amount of tokens from the unstaked tokens.
   * @param  amount the amount to take out
   */
  function withdraw(uint amount) external {

  }

  /**
   * allow video creator to remove a video from the listing and return tokens.
   * @param  videoId videoId to remove
   */
  function exit(string videoId) external {

  }

  /**
  @notice             Updates a videos's status from 'application' to 'listing'
  @notice             or resolves a challenge if one exists.
  @param _videoId      The videoId whose status is being updated
  */
  function updateStatus(string _videoId) public {
    if (canBeWhitelisted(_videoId)) {
      whitelistApplication(_videoId);
      _NewVideoWhitelisted(_videoId);
    } else {
      revert();
    }
  }

  /**
  @dev Called by updateStatus() if the applicationExpiry date passed without a
  challenge being made
  @dev Called by resolveChallenge() if an application/listing beat a challenge.
  @param _videoId The _videoId of an application/listing to be whitelisted
  */
  function whitelistApplication(string _videoId) private {
    bytes32 videoHash = keccak256(_videoId);

    listings[videoHash].whitelisted = true;
  }

  //----------------------------------------------------------------------------
  //  Token HODLers functions
  //--------------------------

  // ---------------------------------------------------------------------------
  // Utilities
  //------------------------
  /// @dev returns true if video is whitelisted
  function isWhitelisted(string _videoId) constant public returns (bool whitelisted) {
    return listings[keccak256(_videoId)].whitelisted;
  }

  // @dev returns true if apply was called for this video
  function appWasMade(string _videoId) constant public returns (bool exists) {
    return listings[keccak256(_videoId)].applicationExpiry > 0;
  }

  /// @dev returns true if the provided termDate has passed
  function isExpired(uint _termDate) constant public returns (bool expired) {
    return _termDate < block.number;
  }

  function getMinDeposit() constant public returns (uint) {
    return minDeposit;
  }

  /**
  @dev                Determines whether the video of an application can be whitelisted.
  @param _videoId      The videoId whose status should be examined
  */
  function canBeWhitelisted(string _videoId) constant public returns (bool) {
    bytes32 videoHash = keccak256(_videoId);

    // Ensures that the application was made,
    // the application period has ended,
    // the video can be whitelisted,
    if (
        appWasMade(_videoId) &&
        isExpired(listings[videoHash].applicationExpiry) &&
        !isWhitelisted(_videoId)
    ) { return true; }

    return false;
  }


}
