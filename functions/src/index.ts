import * as logger from "firebase-functions/logger";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Initialize Firebase Admin SDK
// This ensures it's only initialized once per instance
if (getApps().length === 0) {
  initializeApp();
}

/**
 * Sets a custom 'role' claim on a user's auth token when their
 * corresponding document in the 'users' collection is written.
 */
export const setCustomClaims = onDocumentWritten("users/{userId}", async (event) => {
  const userId = event.params.userId;
  const afterData = event.data?.after.data();
  const beforeData = event.data?.before.data();
  const auth = getAuth();

  const getCurrentClaims = async () => {
    const user = await auth.getUser(userId);
    return { ...(user.customClaims ?? {}) } as Record<string, any>;
  };

  const applyClaims = async (claims: Record<string, any>) => {
    const nextClaims = Object.keys(claims).length ? claims : null;
    await auth.setCustomUserClaims(userId, nextClaims);
  };

  // No data after write (e.g., document deletion). Remove the role claim if it exists.
  if (!afterData) {
    try {
      const currentClaims = await getCurrentClaims();

      if (!("role" in currentClaims)) {
        logger.info(`User doc ${userId} deleted, no role claim to remove.`);
        return;
      }

      delete currentClaims.role;
      await applyClaims(currentClaims);
      logger.info(`Removed role claim for ${userId} after document deletion.`);
    } catch (error) {
      logger.error(`Error removing role claim for ${userId} after deletion:`, error);
    }
    return;
  }

  const newRole = afterData.role;
  const oldRole = beforeData?.role;

  // If the new role is undefined/null, remove the claim.
  if (newRole === undefined || newRole === null) {
    try {
      const currentClaims = await getCurrentClaims();

      if (!("role" in currentClaims)) {
        logger.info(`Role removed for ${userId}, no existing role claim to clear.`);
        return;
      }

      delete currentClaims.role;
      await applyClaims(currentClaims);
      logger.info(`Cleared role claim for ${userId} due to missing role field.`);
    } catch (error) {
      logger.error(`Error clearing role claim for ${userId}:`, error);
    }
    return;
  }

  // If the role hasn't changed, no need to update claims.
  if (newRole === oldRole) {
    logger.info(`Role for ${userId} unchanged, skipping claims update.`);
    return;
  }

  try {
    const currentClaims = await getCurrentClaims();
    const updatedClaims = { ...currentClaims, role: newRole };

    await applyClaims(updatedClaims);
    logger.info(`Successfully set custom claim for ${userId}: { role: ${newRole} }`);
  } catch (error) {
    logger.error(`Error setting custom claim for ${userId}:`, error);
  }
});
