import { NextRequest, NextResponse } from 'next/server';
import { db, admin } from '@/app/lib/firebase-admin';
import { Resend } from 'resend';

export const runtime = 'nodejs';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, role, experience, comments } = body;

    // Validate required fields
    if (!fullName || !email) {
      return NextResponse.json(
        { error: 'Full name and email are required' },
        { status: 400 }
      );
    }

    // Save to Firestore
    const docRef = await db.collection('register_interest').add({
      fullName,
      email,
      phone,
      role,
      experience,
      comments,
      status: 'pending',
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Send confirmation email to user
    await resend.emails.send({
      from: 'noreply@resend.dev',
      to: email,
      subject: 'Registration Interest Received - CPS Club',
      html: `
        <h2>Thank You for Your Interest!</h2>
        <p>Hi ${fullName},</p>
        <p>We've received your registration interest form. Our team will review your submission and get back to you shortly with more information about membership and upcoming matches.</p>
        <p>Here's a summary of what we received:</p>
        <ul>
          <li><strong>Name:</strong> ${fullName}</li>
          <li><strong>Role:</strong> ${role}</li>
          <li><strong>Experience:</strong> ${experience}</li>
        </ul>
        <p>In the meantime, if you have any questions, feel free to reach out at crsvp.2023@gmail.com</p>
        <p>Best regards,<br><strong>CPS Club Team</strong></p>
      `,
    });

    // Send notification email to admin
    await resend.emails.send({
      from: 'noreply@resend.dev',
      to: 'crsvp.2023@gmail.com',
      subject: `New Registration Interest - ${fullName}`,
      html: `
        <h2>New Registration Interest Submission</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Role:</strong> ${role}</p>
        <p><strong>Experience:</strong> ${experience}</p>
        <h3>Comments:</h3>
        <p>${comments ? comments.replace(/\n/g, '<br>') : 'No additional comments'}</p>
        <p><a href="https://cpsclub.com.au/admin/register-interest">View all registrations →</a></p>
      `,
    });

    return NextResponse.json(
      { success: true, message: 'Registration submitted successfully', id: docRef.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Registration interest error:', error);
    return NextResponse.json(
      { error: 'Failed to submit registration' },
      { status: 500 }
    );
  }
}
