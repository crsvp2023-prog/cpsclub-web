import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  try {
    const { email, displayName } = await request.json();

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    // Send password change notification email
    if (resend) {
      console.log("Sending password change notification email to:", email);
      await resend.emails.send({
        from: "CPSC Club <noreply@cpsclub.com.au>",
        to: [email],
        subject: "Password Changed Successfully",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">Password Changed Successfully</h2>
            <p>Hello ${displayName || 'User'},</p>
            <p>Your password has been successfully changed.</p>
            <p>If you did not make this change, please contact us immediately to secure your account.</p>
            <p>For your security, we recommend:</p>
            <ul>
              <li>Using a strong, unique password</li>
              <li>Enabling two-factor authentication if available</li>
              <li>Monitoring your account activity</li>
            </ul>
            <p>Best regards,<br>CPSC Club Team</p>
          </div>
        `,
      });
      console.log("Password change notification email sent successfully");
    } else {
      console.warn("RESEND_API_KEY not configured, skipping password change email");
    }

    return Response.json({ success: true, message: "Password change notification sent" });
  } catch (error) {
    console.error("Password change notification error:", error);
    return Response.json(
      { error: "Failed to send password change notification" },
      { status: 500 }
    );
  }
}