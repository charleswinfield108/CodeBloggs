import DB from "../db/connection.js";
import { ObjectId } from "mongodb";
import USER_SCHEMA from '../db/schemas/user.schema.js';
import BCRYPT from 'bcrypt';

// This route will help you create a new User.
const userCreate = async (req, res) => {
    try {
        const { email, password, ...userData } = req.body;

        if (!email || !password || Object.keys(userData).length === 0) {
            return res.status(400).json({ error: "Invalid user data" });
        }

        // Check if email already exists
        const existingUser = await DB.collection("users").findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const SALT_ROUNDS = 10;
        const hashedPassword = await BCRYPT.hash(password, SALT_ROUNDS);

        const NEW_USER = {
            ...userData,
            email,
            password: hashedPassword,
            auth_level: userData.auth_level || "basic",
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const RESULT = await DB.collection("users").insertOne(NEW_USER);

        if (!RESULT.acknowledged) {
            return res.status(500).json({ error: "User not created" });
        }

        res.status(201).json({
            status: 'ok',
            data: { id: RESULT.insertedId },
            message: 'User created successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// This route will help you update a User by id.
const userUpdate = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const { _id, ...updateUser } = req.body; // Exclude _id from update data

        if (Object.keys(updateUser).length === 0) {
            return res.status(400).json({ error: "No valid fields to update" });
        }

        const QUERY = { _id: new ObjectId(userId) };
        const UPDATES = { 
            $set: { 
                ...updateUser, 
                updatedAt: new Date() 
            } 
        };

        const RESULT = await DB.collection("users").updateOne(QUERY, UPDATES);

        if (RESULT.matchedCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            status: 'ok',
            message: 'User updated successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// This route will help you delete a User
const userDelete = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const USER_COLLECTION = DB.collection("users");
        const POST_COLLECTION = DB.collection("posts");
        const COMMENT_COLLECTION = DB.collection("comments");

        // Check if the user exists
        const user = await USER_COLLECTION.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Find all posts of the user
        const userPosts = await POST_COLLECTION.find({ user_id: new ObjectId(userId) }).toArray();
        const postIds = userPosts.map(post => post._id);

        let deletedCommentsCount = 0;
        let deletedPostsCount = 0;

        // If posts exist, delete comments and posts
        if (postIds.length > 0) {
            const COMMENTS_RESULT = await COMMENT_COLLECTION.deleteMany({ post_id: { $in: postIds } });
            if (!COMMENTS_RESULT.acknowledged) {
                return res.status(500).json({ error: "Failed to delete comments" });
            }
            deletedCommentsCount = COMMENTS_RESULT.deletedCount;

            const POSTS_RESULT = await POST_COLLECTION.deleteMany({ user_id: new ObjectId(userId) });
            if (!POSTS_RESULT.acknowledged) {
                return res.status(500).json({ error: "Failed to delete posts" });
            }
            deletedPostsCount = POSTS_RESULT.deletedCount;
        }

        // Delete the user
        const deleteUserResult = await USER_COLLECTION.deleteOne({ _id: new ObjectId(userId) });
        if (!deleteUserResult.acknowledged || deleteUserResult.deletedCount === 0) {
            return res.status(500).json({ error: "Failed to delete user" });
        }

        res.status(200).json({
            status: 'ok',
            message: `User deleted successfully. Deleted ${deletedPostsCount} posts associated with the user and ${deletedCommentsCount} comments associated with those posts.`,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// This route will help you get a single User by id with his information.
const userGetById = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const QUERY = { _id: new ObjectId(userId) };
        const PROJECTION = { password: 0 }; // Exclude the password field

        const RESULT = await DB.collection("users").findOne(QUERY, PROJECTION);

        if (!RESULT) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            status: 'ok',
            data: RESULT,
            message: 'User retrieved successfully'
        });
    } catch (error) {
        console.error("Error retrieving user by ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// This route will help you get a list of all the Users with their information.
const usersGetAll = async (req, res) => {
    try {
        // Get pagination and filter parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const firstName = req.query.firstName || "";
        const lastName = req.query.lastName || "";
        const startDate = req.query.startDate || "";
        const endDate = req.query.endDate || "";

        // Build filter query (using first_name and last_name from schema)
        const filter = {};
        if (firstName) {
            filter.first_name = { $regex: firstName, $options: "i" }; // Case-insensitive search
        }
        if (lastName) {
            filter.last_name = { $regex: lastName, $options: "i" };
        }

        // Add date range filter if provided
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) {
                filter.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                const endOfDay = new Date(endDate);
                endOfDay.setHours(23, 59, 59, 999);
                filter.createdAt.$lte = endOfDay;
            }
        }

        // Get total count for pagination
        const total = await DB.collection("users").countDocuments(filter);

        // Calculate skip for pagination
        const skip = (page - 1) * limit;

        // Fetch paginated and filtered users
        const USERS = await DB.collection("users")
            .find(filter, { projection: { password: 0 } })
            .skip(skip)
            .limit(limit)
            .toArray();

        if (!USERS || USERS.length === 0) {
            return res.status(200).json({ 
                users: [], 
                total: 0, 
                pages: 0 
            });
        }

        // Calculate isOnline based on lastSeen timestamp (8 minute timeout)
        const TIMEOUT_MS = 8 * 60 * 1000; // 8 minutes
        const NOW = Date.now();

        const USERS_WITH_STATUS = USERS.map(user => {
            const lastSeenTime = user.lastSeen ? new Date(user.lastSeen).getTime() : 0;
            const isOnline = (NOW - lastSeenTime) < TIMEOUT_MS;

            return {
                ...user,
                birthdate: user.birthday, // Add birthdate field for frontend compatibility
                isOnline
            };
        });

        // Calculate total pages
        const pages = Math.ceil(total / limit);

        res.status(200).json({
            users: USERS_WITH_STATUS,
            total: total,
            pages: pages
        });
    } catch (error) {
        console.error("Error retrieving users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// This route will help you get all information from a User by id, including posts and comments
const userGetInfo = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const USER_COLLECTION = DB.collection("users");
        const POST_COLLECTION = DB.collection("posts");

        const QUERY = { _id: new ObjectId(userId) };
        const PROJECTION = { password: 0 }; // Exclude the password field

        const userResult = await USER_COLLECTION.findOne(QUERY, PROJECTION);

        if (!userResult) {
            return res.status(404).json({ error: "User not found" });
        }

        const postResult = await POST_COLLECTION.find({ user_id: new ObjectId(userId) }).toArray();

        const COMMENTS = await POST_COLLECTION.aggregate([
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "post_id",
                    as: "comments"
                }
            }
        ]).toArray();

        const formattedPosts = postResult.map((post) => ({
            _id: post._id,
            content: post.content,
            likes: post.likes,
            createdAt: post.createdAt,
            comments: COMMENTS.find((comment) => comment._id.toString() === post._id.toString())?.comments || []
        }));

        res.status(200).json({
            status: 'ok',
            data: {
                user: userResult,
                totalPosts: postResult.length,
                posts: formattedPosts.length > 0 ? formattedPosts : [{ content: "No posts yet by the user." }]
            },
            message: 'User and posts retrieved successfully'
        });
    } catch (error) {
        console.error("Error retrieving user info:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// This route will help you get all information from all users, including posts and comments
const usersGetInfo = async (req, res) => {
    try {
        const USER_COLLECTION = DB.collection("users");
        const POST_COLLECTION = DB.collection("posts");

        const [users, posts] = await Promise.all([
            USER_COLLECTION.find({}, { projection: { password: 0 } }).toArray(),
            POST_COLLECTION.find({}).toArray()
        ]);

        if (!users || users.length === 0) {
            return res.status(404).json({ error: "No users found" });
        }

        const commentsByPostId = await POST_COLLECTION.aggregate([
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "post_id",
                    as: "comments"
                }
            },
            {
                $project: {
                    _id: 1,
                    comments: 1
                }
            }
        ]).toArray();

        const commentsMap = commentsByPostId.reduce((map, post) => {
            map[post._id.toString()] = post.comments || [];
            return map;
        }, {});

        const formattedUsers = users.map((user) => {
            const userPosts = posts.filter((post) => post.user_id.toString() === user._id.toString());
            const formattedPosts = userPosts.map((post) => ({
                _id: post._id,
                content: post.content,
                likes: post.likes,
                createdAt: post.createdAt,
                comments: commentsMap[post._id.toString()] || []
            }));

            return {
                info: user,
                totalPosts: userPosts.length,
                posts: formattedPosts.length > 0 ? formattedPosts : [{ content: "No posts yet by the user." }]
            };
        });

        res.status(200).json({
            status: 'ok',
            data: formattedUsers,
            message: 'All users retrieved successfully'
        });
    } catch (error) {
        console.error("Error retrieving users info:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Update user online status
const userUpdateStatus = async (req, res) => {
    try {
        const userId = req.params.id;
        const { isOnline } = req.body;

        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const updateData = {
            isOnline: Boolean(isOnline),
            lastSeen: new Date(),
            updatedAt: new Date()
        };

        const RESULT = await DB.collection("users").updateOne(
            { _id: new ObjectId(userId) },
            { $set: updateData }
        );

        if (RESULT.matchedCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            status: 'ok',
            message: 'User status updated successfully'
        });
    } catch (error) {
        console.error("Error updating user status:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Ping endpoint to update lastSeen timestamp (activity tracker)
const userPing = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const RESULT = await DB.collection("users").updateOne(
            { _id: new ObjectId(userId) },
            { $set: { lastSeen: new Date() } }
        );

        if (RESULT.matchedCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            status: 'ok',
            message: 'Activity recorded'
        });
    } catch (error) {
        console.error("Error updating user activity:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export default {
    userCreate,
    userUpdate,
    userDelete,
    userGetById,
    usersGetAll,
    userGetInfo,
    usersGetInfo,
    userUpdateStatus,
    userPing,
};