import jwt from "jsonwebtoken";
import { RevokedToken } from "../models/RevokedToken.js";
import { User } from "../models/User.js";
import { hashAuthToken } from "../utils/authTokenUtils.js";

const DEFAULT_JWT_SECRET = "silver-gym-dev-secret-change-me";

async function requireAuth(request, response, next) {
  try {
    const authHeader = request.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return response.status(401).json({ message: "Authentication token required." });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || DEFAULT_JWT_SECRET);
    const revokedToken = await RevokedToken.exists({
      tokenHash: hashAuthToken(token),
    });

    if (revokedToken) {
      return response.status(401).json({ message: "Session has been logged out." });
    }

    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return response.status(401).json({ message: "User not found." });
    }

    if (Number(decodedToken.tokenVersion ?? -1) !== Number(user.tokenVersion || 0)) {
      return response.status(401).json({ message: "Session is no longer valid. Please login again." });
    }

    if (
      user.passwordChangedAt &&
      Number(decodedToken.iat) < Math.floor(user.passwordChangedAt.getTime() / 1000)
    ) {
      return response.status(401).json({ message: "Password changed. Please login again." });
    }

    request.user = user;
    request.authToken = token;
    request.authTokenPayload = decodedToken;

    return next();
  } catch {
    return response.status(401).json({ message: "Invalid or expired token." });
  }
}

function requireRole(...allowedRoles) {
  return (request, response, next) => {
    if (!allowedRoles.includes(request.user?.role)) {
      return response.status(403).json({ message: "You do not have permission for this action." });
    }

    return next();
  };
}

export { DEFAULT_JWT_SECRET, requireAuth, requireRole };
