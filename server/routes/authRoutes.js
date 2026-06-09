import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes } from "node:crypto";
import { Router } from "express";
import { USER_ROLES } from "../constants/auth.js";
import { DEFAULT_JWT_SECRET, requireAuth } from "../middleware/authMiddleware.js";
import { PasswordResetToken } from "../models/PasswordResetToken.js";
import { RevokedToken } from "../models/RevokedToken.js";
import { User } from "../models/User.js";
import { hashAuthToken } from "../utils/authTokenUtils.js";

const router = Router();
const DEFAULT_RESET_EXPIRY_MINUTES = 15;

function createToken(user) {
  return jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      tokenVersion: Number(user.tokenVersion || 0),
    },
    process.env.JWT_SECRET || DEFAULT_JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
  );
}

function toClientUser(user, token) {
  return {
    name: user.name,
    email: user.email,
    role: user.role || USER_ROLES.USER,
    token,
  };
}

function getResetExpiryDate() {
  const expiryMinutes = Number(
    process.env.RESET_TOKEN_EXPIRES_MINUTES || DEFAULT_RESET_EXPIRY_MINUTES,
  );

  return new Date(Date.now() + expiryMinutes * 60 * 1000);
}

function shouldExposeResetLink() {
  return process.env.NODE_ENV !== "production" || process.env.EXPOSE_RESET_LINK === "true";
}

router.post("/login", async (request, response, next) => {
  try {
    const email = String(request.body.email || "").trim().toLowerCase();
    const password = String(request.body.password || "");
    const user = await User.findOne({ email }).select("+passwordHash");

    if (!user) {
      return response.status(401).json({ message: "Invalid email or password." });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      return response.status(401).json({ message: "Invalid email or password." });
    }

    const token = createToken(user);

    return response.json({
      token,
      user: toClientUser(user, token),
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/forgot-password", async (request, response, next) => {
  try {
    const email = String(request.body.email || "").trim().toLowerCase();
    const user = await User.findOne({ email });
    const responseBody = {
      message: "If this email exists, a password reset link has been generated.",
    };

    if (!user) {
      return response.json(responseBody);
    }

    const resetToken = randomBytes(32).toString("hex");
    const expiresAt = getResetExpiryDate();

    await PasswordResetToken.deleteMany({ userId: user._id });
    await PasswordResetToken.create({
      userId: user._id,
      tokenHash: hashAuthToken(resetToken),
      expiresAt,
    });

    if (shouldExposeResetLink()) {
      const clientOrigin = (
        process.env.CLIENT_APP_URL
        || process.env.CLIENT_ORIGIN
        || "http://127.0.0.1:5173"
      )
        .split(",")[0]
        .trim()
        .replace(/\/$/, "");

      responseBody.resetToken = resetToken;
      responseBody.resetUrl = `${clientOrigin}/reset-password?token=${resetToken}`;
      responseBody.expiresAt = expiresAt.toISOString();
    }

    return response.json(responseBody);
  } catch (error) {
    return next(error);
  }
});

router.post("/reset-password", async (request, response, next) => {
  try {
    const resetToken = String(request.body.token || "");
    const password = String(request.body.password || "");

    if (!resetToken) {
      return response.status(400).json({ message: "Reset token is required." });
    }

    if (password.length < 8) {
      return response.status(400).json({ message: "Password must be at least 8 characters." });
    }

    const tokenRecord = await PasswordResetToken.findOne({
      tokenHash: hashAuthToken(resetToken),
      expiresAt: { $gt: new Date() },
    });

    if (!tokenRecord) {
      return response.status(400).json({ message: "Reset link is invalid or expired." });
    }

    const user = await User.findById(tokenRecord.userId).select("+passwordHash");

    if (!user) {
      return response.status(400).json({ message: "Reset link is invalid or expired." });
    }

    user.passwordHash = await bcrypt.hash(password, 10);
    user.passwordChangedAt = new Date();
    user.tokenVersion = Number(user.tokenVersion || 0) + 1;

    await user.save();
    await PasswordResetToken.deleteMany({ userId: user._id });

    return response.json({
      ok: true,
      message: "Password reset successfully. Please login with your new password.",
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/me", requireAuth, (request, response) => {
  response.json({
    user: {
      name: request.user.name,
      email: request.user.email,
      role: request.user.role || USER_ROLES.USER,
    },
  });
});

router.post("/logout", requireAuth, async (request, response, next) => {
  try {
    const expiresAt = new Date(Number(request.authTokenPayload.exp) * 1000);

    await RevokedToken.updateOne(
      { tokenHash: hashAuthToken(request.authToken) },
      { $set: { expiresAt } },
      { upsert: true },
    );

    response.json({
      ok: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    next(error);
  }
});

export { router as authRoutes };
