import * as admin from 'firebase-admin';

function getAdminApp() {
    if (admin.apps.length > 0) {
        return admin.apps[0];
    }

    console.log("Initializing Firebase Admin for project:", "growthpilot-firebase");

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            return admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: "growthpilot-firebase",
            });
        } catch (error) {
            console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT:", error);
        }
    }

    return admin.initializeApp({
        projectId: "growthpilot-firebase",
    });
}

const app = getAdminApp();
export const adminAuth = admin.auth(app || undefined);
export const adminDb = admin.firestore(app || undefined);
