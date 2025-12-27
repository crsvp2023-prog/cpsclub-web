import { db, admin } from "@/app/lib/firebase-admin";

export const runtime = 'nodejs';

// Get IP address from request headers
function getIpFromRequest(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : request.headers.get("x-real-ip") || "unknown";
  return ip;
}

// Get location from IP using free API
async function getLocationFromIp(ip: string) {
  try {
    if (ip === "unknown" || ip === "::1" || ip === "127.0.0.1") {
      return {
        country: "Local/Development",
        city: "Local",
        region: "Local",
        latitude: 0,
        longitude: 0,
      };
    }

    const response = await fetch(`https://ip-api.com/json/${ip}?fields=country,city,regionName,lat,lon`);
    if (!response.ok) throw new Error("Location lookup failed");

    const data = await response.json();
    return {
      country: data.country || "Unknown",
      city: data.city || "Unknown",
      region: data.regionName || "Unknown",
      latitude: data.lat || 0,
      longitude: data.lon || 0,
    };
  } catch (error) {
    console.error("Error getting location:", error);
    return {
      country: "Unknown",
      city: "Unknown",
      region: "Unknown",
      latitude: 0,
      longitude: 0,
    };
  }
}

export async function POST(request: Request) {
  let requestBody: {
    uid?: string;
    email?: string;
    displayName?: string;
    photoURL?: string;
    phone?: string;
    role?: string;
  } = { uid: '', email: '' };
  
  try {
    // Parse request body
    try {
      requestBody = await request.json();
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return Response.json(
        { 
          error: "Invalid request body",
          details: "Failed to parse JSON"
        },
        { status: 400 }
      );
    }

    const { uid, email, displayName, photoURL, phone, role } = requestBody;

    // Validate required fields
    if (!uid || !email) {
      console.warn("Missing required fields:", { uid: !!uid, email: !!email });
      return Response.json(
        { error: "Missing required fields: uid, email" },
        { status: 400 }
      );
    }

    console.log("Updating user profile for:", { uid, email, displayName });

    // Get IP address
    const ip = getIpFromRequest(request);

    // Get location from IP
    const location = await getLocationFromIp(ip);

    // Reference to user document
    const userRef = db.collection('users').doc(uid);

    // User data to save/update
    const userData = {
      uid,
      email,
      displayName: displayName || "",
      photoURL: photoURL || "",
      phone: phone || "",
      role: role || "member",
      ip,
      location: {
        country: location.country,
        city: location.city,
        region: location.region,
        latitude: location.latitude,
        longitude: location.longitude,
      },
      lastLogin: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    console.log("Attempting to save user data to Firestore...");
    console.log("User data to save:", userData);

    // Save/update user profile in Firestore using Admin SDK
    try {
      const userRef = db.collection('users').doc(uid);
      console.log("User ref created:", userRef.path);
      await userRef.set(userData, { merge: true });
      console.log("User profile saved successfully for:", uid);
    } catch (firestoreError) {
      const fsErrorMessage = firestoreError instanceof Error ? firestoreError.message : String(firestoreError);
      const fsErrorCode = (firestoreError as any)?.code || "UNKNOWN";
      console.error("Firestore set failed:", {
        message: fsErrorMessage,
        code: fsErrorCode,
        error: JSON.stringify(firestoreError),
      });
      throw firestoreError;
    }

    return Response.json(
      {
        success: true,
        message: "User profile updated successfully",
        user: userData,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorCode = (error as any)?.code;
    const errorStack = error instanceof Error ? error.stack : '';
    
    console.error("User update error:", {
      message: errorMessage,
      code: errorCode,
      stack: errorStack,
      stringified: JSON.stringify(error),
    });
    
    return Response.json(
      { 
        error: "Failed to update user profile",
        details: errorMessage,
        code: errorCode,
      },
      { status: 500 }
    );
  }
}
