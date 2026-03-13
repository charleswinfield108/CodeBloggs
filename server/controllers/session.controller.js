import DB from "../db/connection.js";
import { ObjectId } from "mongodb";
import { v4 as uuidv4 } from 'uuid';
import BCRYPT from "bcrypt";

/**
 * sessionLogin - POST /session/login
 * Authenticates user with email and password
 * Creates session token and marks user as online
 * 
 * Request body: { email: string, password: string }
 * Response: { session_token, id, first_name, last_name, auth_level, isOnline }
 * 
 * Status codes:
 * - 200: Login successful, session created
 * - 400: Missing email or password
 * - 401: Invalid email or password
 * - 500: Server error
 */
const sessionLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate that both email and password are provided
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Query database for user with matching email
        const USER = await DB.collection("users").findOne({ email });
        if (!USER) {
            // Generic error message for security (doesn't reveal if email exists)
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Securely compare provided password with stored bcrypt hash
        // bcrypt.compare handles timing attack prevention automatically
        const isPasswordValid = await BCRYPT.compare(password, USER.password || '');
        if (!isPasswordValid) {
            // Same generic error message for consistency
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Update user document: mark online and set current timestamp
        await DB.collection("users").updateOne(
            { _id: USER._id },
            { $set: { isOnline: true, lastSeen: new Date() } }
        );

        // Generate cryptographically random session token (UUID v4)
        const session_token = uuidv4();

        // Create session document to store on backend
        const NEW_SESSION = {
            session_token,
            session_date: new Date(),
            user_id: USER._id.toString()
        };

        // Store session in database for server-side validation
        const SESSIONS_COLLECTION = DB.collection("sessions");
        await SESSIONS_COLLECTION.insertOne(NEW_SESSION);

        // Extract user fields to return to frontend
        const { _id, first_name, last_name, auth_level } = USER;
        return res.status(200).json({
            session_token,
            id: _id.toString(),
            first_name,
            last_name,
            auth_level,
            isOnline: true  // Confirm user is online after login
        });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * sessionLogout - POST /session/logout
 * Logs out user by destroying their session
 * Marks user as offline and deletes session from database
 * 
 * Query params: token (session token)
 * Response: { message: "Successfully logged out" }
 * 
 * Status codes:
 * - 200: Logout successful, session deleted
 * - 400: Missing session token
 * - 404: Session token not found
 * - 500: Server error
 */
const sessionLogout = async (req, res) => {
    const TOKEN = req.query.token;

    // Validate that session token is provided
    if (!TOKEN) {
        return res.status(400).json({ error: "Session token is required" });
    }

    try {
        // Find session document using token
        const SESSION = await DB.collection("sessions").findOne({ session_token: TOKEN });

        if (!SESSION) {
            // Token doesn't exist or already deleted
            return res.status(404).json({ error: "Invalid or non-existent session token" });
        }

        // Update user: mark offline and set logout timestamp
        await DB.collection("users").updateOne(
            { _id: new ObjectId(SESSION.user_id) },
            { $set: { isOnline: false, lastSeen: new Date() } }
        );

        // Delete session from database (invalidates token)
        await DB.collection("sessions").deleteOne({ session_token: TOKEN });

        // Confirm logout success
        return res.status(200).json({ message: "Successfully logged out" });
    } catch (error) {
        console.error("Error during logout:", error);
        // Return generic error for security
        return res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * sessionGet - GET /session/:id
 * Retrieves a specific session by MongoDB ObjectId
 * 
 * Params: id (session MongoDB ID)
 * Response: { status, data: session, message }
 * 
 * Status codes:
 * - 200: Session found
 * - 400: Missing session ID
 * - 404: Session not found
 * - 500: Server error
 */
const sessionGet = async (req, res) => {
    const { id } = req.params;

    // Validate that session ID is provided
    if (!id) {
        return res.status(400).json({ error: "Session ID is required" });
    }

    try {
        // Query database for session with matching MongoDB ID
        const SESSION = await DB.collection("sessions").findOne({ _id: new ObjectId(id) });

        // Check if session exists
        if (!SESSION) {
            return res.status(404).json({ error: "Session not found" });
        }

        // Return session details
        return res.status(200).json({
            status: "ok",
            data: SESSION,
            message: "Session retrieved successfully",
        });
    } catch (error) {
        console.error("Error retrieving session:", error);
        // Return generic error for security
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

/**
 * sessionGetAll - GET /sessions
 * Retrieves all active sessions from database
 * Useful for admin purposes or tracking active users
 * 
 * Response: { status, data: sessions[], message }
 * 
 * Status codes:
 * - 200: Sessions found (may be empty array)
 * - 404: No sessions exist
 * - 500: Server error
 */
const sessionGetAll = async (req, res) => {
    try {
        // Fetch all session documents from database
        const SESSIONS = await DB.collection("sessions").find({}).toArray();

        // Check if any sessions exist
        if (SESSIONS.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "No sessions found",
            });
        }

        // Return all sessions
        return res.status(200).json({
            status: "ok",
            data: SESSIONS,
            message: "Sessions retrieved successfully",
        });
    } catch (error) {
        console.error("Error retrieving sessions:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

/**
 * sessionCreate - POST /session/:id
 * Creates a new session for a specific user
 * Used to programmatically create sessions (e.g., admin login on behalf of user)
 * Sets up TTL index for automatic session expiration after 24 hours
 * 
 * Params: id (user MongoDB ID)
 * Response: { status, data: { token }, message }
 * 
 * Status codes:
 * - 201: Session created successfully
 * - 400: Missing user ID
 * - 404: User not found
 * - 500: Server error
 */
const sessionCreate = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate that user ID is provided
        if (!id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // Check if user exists before creating session
        const USER = await DB.collection("users").findOne({ _id: new ObjectId(id) });
        if (!USER) {
            return res.status(404).json({ error: "User not found" });
        }

        // Generate new unique session token
        const session_token = uuidv4();

        // Ensure sessions collection has TTL index for auto-expiration
        // Sessions expire after 86400 seconds (24 hours)
        const COLLECTION = DB.collection("sessions");
        await COLLECTION.createIndex({ "session_date": 1 }, { expireAfterSeconds: 86400 });

        // Create session object
        const NEW_SESSION = {
            session_token,
            session_date: new Date(),
            user_id: id
        };

        // Insert session into database
        await COLLECTION.insertOne(NEW_SESSION);

        // Return created session token
        return res.status(201).json({
            status: "ok",
            data: { token: session_token },
            message: "Session created successfully",
        });
    } catch (error) {
        console.error("Error creating session:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

/**
 * sessionValidateToken - GET /validate_token
 * Validates a session token and returns associated user information
 * Called by frontend/other services to verify session authenticity
 * 
 * Query params: token (session token to validate)
 * Response: { status, data: { valid, user }, message }
 * 
 * Status codes:
 * - 200: Token valid, user info returned
 * - 400: Missing token
 * - 401: Token invalid or expired
 * - 500: Server error
 */
const sessionValidateToken = async (req, res) => {
    const TOKEN = req.query.token;

    // Validate that token is provided
    if (!TOKEN) {
        return res.status(400).json({ status: 'error', data: null, message: 'Session token is required' });
    }

    try {
        // Look up session using token
        const SESSION = await DB.collection("sessions").findOne({ session_token: TOKEN });
        if (!SESSION) {
            // Token doesn't exist or has expired
            return res.status(401).json({ status: 'error', data: null, message: 'Invalid session token' });
        }

        // Get user associated with session
        const USER = await DB.collection("users").findOne({ _id: new ObjectId(SESSION.user_id) });
        if (!USER) {
            // User was deleted or session is orphaned
            return res.status(401).json({ status: 'error', data: null, message: 'Invalid user session' });
        }

        // Extract user fields for response
        const { _id, first_name, last_name, auth_level } = USER;
        return res.status(200).json({
            status: 'ok',
            data: {
                valid: true,
                user: { id: _id.toString(), first_name, last_name, auth_level },
            },
            message: 'Session token validated successfully',
        });
    } catch (error) {
        console.error("Error validating session token:", error);
        return res.status(500).json({
            status: 'error',
            data: null,
            message: 'Internal server error',
        });
    }
};

export default {
    sessionLogin,
    sessionLogout,
    sessionGet,
    sessionGetAll,
    sessionCreate,
    sessionValidateToken
};