const router = require("express").Router();
const { models: { Friend, User } } = require("../db");

// Send a friend request
router.post("/", async (req, res, next) => {
  try {
    const { userId, friendId} = req.body;

    // Check if a friend request already exists
    const existingFriend = await Friend.findOne({
      where: { userId, friendId },
    });

    if (existingFriend) {
      return res.status(400).send("Friend request already exists.");
    }

    // Create the friend request
    const newFriend = await Friend.create({ userId, friendId});
    res.status(201).json(newFriend);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const friends = await Friend.findAll();
    res.json(friends);
  } catch (err) {
    next(err);
  }
});

// Get all friends for a user
router.get("/:userId", async (req, res, next) => {
  try {
    const friends = await Friend.findAll({
      where: { userId: req.params.userId, status: "accepted" },
      // include: [
      //   { model: User, as: "friend", attributes: ["id", "username", "email"] },
      // ],
    });

    res.json(friends);
  } catch (err) {
    next(err);
  }
});

// Accept a friend request
router.put("/:friendId", async (req, res, next) => {
  try {
    const { status } = req.body;
    const friend = await Friend.findOne({ where: { id: req.params.friendId } });
    if (!friend) {
      return res.status(404).send("Friend request not found.");
    }

    const updatedFriend = await friend.update( {status});
    res.json(updatedFriend);
  } catch (err) {
    next(err);
  }
});

// Reject a friend request
router.delete("/:friendId", async (req, res, next) => {
  try {
    const friend = await Friend.findOne({ where: { id: req.params.friendId } });
    if (!friend) {
      return res.status(404).send("Friend request not found.");
    }

    await friend.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
