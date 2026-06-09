import { createHash } from "node:crypto";

function hashAuthToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

export { hashAuthToken };
