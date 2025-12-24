import { Resend } from "resend";
import { contactConfig } from "@/app/config/contact";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send email to support inbox
    const result = await resend.emails.send({
      from: "CPS Club <support@cpsclub.com.au>",
      to: contactConfig.emails.info,
      replyTo: email,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #1A5490;">New Contact Form Submission</h2>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Message:</h3>
            <p style="white-space: pre-wrap; color: #555;">${message}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 12px; color: #999;">
            This is an automated message from the CPS Club contact form.
          </p>
        </div>
      `,
    });

    if (result.error) {
      console.error("Resend error:", result.error);
      return Response.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    // Send confirmation email to user
    await resend.emails.send({
      from: "CPS Club <noreply@resend.dev>",
      to: email,
      subject: "We received your message - CPS Club",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #1A5490;">Thank You!</h2>
          <p>Hi ${name},</p>
          <p>We've received your message and will get back to you within 24 hours.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Subject:</strong> ${subject}</p>
            <p style="color: #999; margin: 10px 0 0 0;">Message ID: ${result.data?.id || "N/A"}</p>
          </div>
          <p>In the meantime, feel free to reach out to us:</p>
          <p>
            📧 Email: ${contactConfig.emails.info}<br/>
            📞 Phone: ${contactConfig.phone.main}<br/>
            📍 Location: ${contactConfig.location.name}
          </p>
          <p>Best regards,<br/><strong>CPS Club Team</strong></p>
        </div>
      `,
    });

    return Response.json(
      { 
        success: true, 
        message: "Email sent successfully",
        id: result.data?.id 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
