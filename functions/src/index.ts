import * as logger from "firebase-functions/logger";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Initialize Firebase Admin SDK
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

  // No data after write? (e.g., deletion). Do nothing.
  if (!afterData) {
    logger.info(`User doc ${userId} deleted, no claims to update.`);
    return;
  }

  const newRole = afterData.role;
  const oldRole = beforeData?.role;

  // If the role hasn't changed, no need to update claims.
  if (newRole === oldRole) {
    logger.info(`Role for ${userId} unchanged, skipping claims update.`);
    return;
  }

  // Role is new or has changed. Update the custom claim.
  try {
    const auth = getAuth();
    await auth.setCustomUserClaims(userId, { role: newRole });
    logger.info(`Successfully set custom claim for ${userId}: { role: ${newRole} }`);
  } catch (error) {
    logger.error(`Error setting custom claim for ${userId}:`, error);
  }
});
