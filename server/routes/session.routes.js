import SESSION_ROUTES from '../controllers/session.controller.js';

/**
 * sessionRoutesEndpoint - Defines all session-related API routes
 * 
 * Routes defined:
 * - POST /session/login - Authenticate user with email/password
 * - POST /session/logout - Log out user and delete session
 * - GET /session/:id - Retrieve specific session by ID
 * - GET /sessions - Get all sessions (admin)
 * - POST /session/:id - Create new session for user
 * - GET /validate_token - Validate session token
 */
const sessionRoutesEndpoint = (app) => {
    // Login: POST /session/login
    // Authenticates user, creates session, returns token and user info
    app.post("/session/login", SESSION_ROUTES.sessionLogin);
    
    // Logout: POST /session/logout
    // Removes session from DB, marks user offline
    app.post("/session/logout", SESSION_ROUTES.sessionLogout);
    
    // Get Session: GET /session/:id
    // Retrieves a specific session by MongoDB ObjectId
    app.get("/session/:id", SESSION_ROUTES.sessionGet);
    
    // Get All Sessions: GET /sessions
    // Returns list of all active sessions (admin use)
    app.get("/sessions", SESSION_ROUTES.sessionGetAll);
    
    // Create Session: POST /session/:id
    // Creates new session for user (programmatic login)
    app.post("/session/:id", SESSION_ROUTES.sessionCreate);
    
    // Validate Token: GET /validate_token
    // Verifies session token is valid and returns associated user
    app.get("/validate_token", SESSION_ROUTES.sessionValidateToken);
}

export default {
    sessionRoutesEndpoint
};