import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyName, contactName, email, phone, tierInterest, message } = body;

    // Validate required fields
    if (!companyName || !contactName || !email || !tierInterest) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send email to CPS Club
    await resend.emails.send({
      from: 'noreply@resend.dev',
      to: 'crsvp.2023@gmail.com',
      subject: `New Sponsorship Inquiry - ${companyName}`,
      html: `
        <h2>New Sponsorship Inquiry</h2>
        <p><strong>Company Name:</strong> ${companyName}</p>
        <p><strong>Contact Name:</strong> ${contactName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Tier Interest:</strong> ${tierInterest}</p>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    // Send confirmation email to inquirer
    await resend.emails.send({
      from: 'noreply@resend.dev',
      to: email,
      subject: 'CPS Club - Sponsorship Inquiry Received',
      html: `
        <h2>Thank You for Your Interest!</h2>
        <p>Hi ${contactName},</p>
        <p>We've received your sponsorship inquiry for the <strong>${tierInterest}</strong> package. Our team will review your submission and get back to you shortly.</p>
        <p>In the meantime, if you have any questions, feel free to reach out at crsvp.2023@gmail.com</p>
        <p>Best regards,<br><strong>CPS Club Team</strong></p>
      `,
    });

    return NextResponse.json(
      { success: true, message: 'Inquiry submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Sponsorship inquiry error:', error);
    return NextResponse.json(
      { error: 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
}
