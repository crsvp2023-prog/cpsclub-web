import { db, admin } from "@/app/lib/firebase-admin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, firstName } = await request.json();

    // Validate email
    if (!email || !email.includes("@")) {
      return Response.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const subscribersRef = db.collection("newsletter_subscribers");
    const existingDocs = await subscribersRef.where("email", "==", email).get();

    if (!existingDocs.empty) {
      return Response.json(
        { error: "This email is already subscribed to our newsletter" },
        { status: 409 }
      );
    }

    // Add to Firestore
    const docRef = await subscribersRef.add({
      email,
      firstName: firstName || "Friend",
      subscribedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: "active",
    });

    // Send welcome email via Resend
    try {
      await resend.emails.send({
        from: "CPS Club <noreply@resend.dev>",
        to: email,
        subject: "Welcome to CPS Club Newsletter! 🎉",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
            <h2 style="color: #1A5490;">Welcome to CPS Club!</h2>
            <p>Hi ${firstName || "Friend"},</p>
            <p>Thank you for subscribing to our newsletter! 🙌</p>
            
            <div style="background-color: #f0f8ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;">You'll now receive:</p>
              <ul style="margin: 10px 0;">
                <li>🏏 Match updates and schedules</li>
                <li>📰 Latest cricket news</li>
                <li>🎟️ Exclusive event announcements</li>
                <li>🏆 Sponsor highlights and offers</li>
                <li>⭐ Member achievements & stories</li>
              </ul>
            </div>
            
            <p>Check out what's happening at CPS Club:</p>
            <a href="https://cpsclub.com.au" style="display: inline-block; padding: 12px 24px; background-color: #1A5490; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">Visit Our Website</a>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <div style="font-size: 12px; color: #999;">
              <p>Questions? Reply to this email or visit our <a href="https://cpsclub.com.au/contact">contact page</a>.</p>
              <p>© 2025 CPS Club. All rights reserved.</p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
      // Don't fail the subscription if email sending fails
    }

    return Response.json(
      {
        success: true,
        message: "Welcome to our newsletter! Check your email for details.",
        subscriberId: docRef.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return Response.json(
      { error: "Failed to subscribe. Please try again later." },
      { status: 500 }
    );
  }
}
