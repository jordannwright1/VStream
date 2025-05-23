import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";


export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user._id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        {_id: {$ne: currentUserId}},
        {_id: {$nin: currentUser.friends}},
        {isOnboarded: true}
      ]
    })
    res.status(200).json(recommendedUsers)
  } catch (error) {
    console.error("Error in getRecommendedUsers controller", error.message);
    res.status(500).json({message: "Internal server error"});
  }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user._id).select('friends').populate("friends", "fullName profilePic nativeLanguage learningLanguage")

    res.status(200).json(user.friends)
  } catch (error) {
    console.error("Error in getMyFriends controller", error.message);
    res.status(500).json({message: "Internal server error"});
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user._id;
    const {id: recipientId} = req.params;

    if (myId === recipientId) {
      return res.status(400).json({message: "You can't send friend request to yourself"});
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({message: "Recipient not found"});
    }

    if (recipient.friends.includes(myId)) {
      return res.status(400).json({message: "You are already friends with this user"});
    }

    const existingRequest = await FriendRequest.findOne({
      $or:[
        {sender: myId, recipient: recipientId},
        {sender: recipientId, recipient: myId},
      ],
    });

    if (existingRequest) {
      return res.status(400).json({message: "A friend request already exists between you and this user"});
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    })

    res.status(201).json(friendRequest)
  } catch (error) {
    console.error("Error in sendFriendRequest controller", error.message);
    res.status(500).json({message: "Internal server error"});
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const {id: requestId} = req.params;
    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({message: "Friend request not found"});
    }

    friendRequest.status = "accepted"
    await friendRequest.save();

    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: {friends: friendRequest.recipient}
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: {friends: friendRequest.sender}
    });

    res.status(200).json({message: "Friend request accepted"});

  } catch (error) {
    console.log("Error in acceptFriendRequest controller", error.message);
    res.status(500).json({message: "Internal server error"});
  }
}

export async function getFriendRequests(req, res) {
  try {
    const incomingRequests = await FriendRequest.find({
      recipient: req.user._id,
      status: "pending",
    }).populate('sender', "fullName profilePic nativeLanguage learningLanguage");

    const acceptedRequests = await FriendRequest.find({
      sender: req.user._id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic")

    res.status(200).json({incomingRequests, acceptedRequests});

  } catch (error) {
    console.log("Error in getFriendRequests controller", error.message);
    res.status(500).json({message: "Internal server error"});
  }
}

export async function getOutgoingFriendRequests(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user._id,
      status: "pending",
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.log("Error in getOutgoingRequests controller", error.message);
    res.status(500).json({message: "Internal server error"});
  }
}

export async function deleteNotification(req, res) {
  try {
    const {id:notificationId} = req.params;
    if (!notificationId) {
      return res.status(400).json({ message: "Notification ID is required" });
    }

    const deletedRequest = await FriendRequest.findByIdAndDelete(notificationId);

    if (!deletedRequest) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({message: "Notification deleted successfully"})
  } catch (error) {
    console.log("There was an error deleting notification: ". error.message);
    res.status(500).json({message: "Internal server error"});
  }
}
