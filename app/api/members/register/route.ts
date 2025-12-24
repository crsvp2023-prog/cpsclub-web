import { NextRequest, NextResponse } from 'next/server';
import { db, admin } from '@/app/lib/firebase-admin';
import { Resend } from 'resend';

export const runtime = 'nodejs';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, role, experience, comments } = body;

    if (!fullName || !email) {
      return NextResponse.json(
        { error: 'Full name and email are required' },
        { status: 400 }
      );
    }

    // Check if member already exists
    const membersRef = db.collection('members');
    const memberSnapshot = await membersRef.where('email', '==', email).get();

    if (!memberSnapshot.empty) {
      return NextResponse.json(
        { error: 'Email already registered. Please login to manage your availability.' },
        { status: 409 }
      );
    }

    // Register as member
    const newMember = await membersRef.add({
      fullName,
      email,
      phone,
      role,
      experience,
      comments,
      registeredAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'pending', // pending, approved, rejected
    });

    // Send confirmation email to user
    await resend.emails.send({
      from: 'noreply@resend.dev',
      to: email,
      subject: 'Welcome to CPS Club - Member Registration Confirmed',
      html: `
        <h2>Welcome to CPS Club!</h2>
        <p>Hi ${fullName},</p>
        <p>Thank you for registering as a member of CPS Club. Your registration has been submitted for review.</p>
        <p><strong>Registration Details:</strong></p>
        <ul>
          <li>Name: ${fullName}</li>
          <li>Role: ${role}</li>
          <li>Experience: ${experience}</li>
        </ul>
        <p>Once approved, you'll be able to:</p>
        <ul>
          <li>Indicate your availability for upcoming matches</li>
          <li>Manage your player profile</li>
          <li>Receive match notifications</li>
        </ul>
        <p>Our team will contact you shortly with next steps.</p>
        <p>Best regards,<br><strong>CPS Club Team</strong></p>
      `,
    });

    // Send notification to admin
    await resend.emails.send({
      from: 'noreply@resend.dev',
      to: 'crsvp.2023@gmail.com',
      subject: `New Member Registration - ${fullName}`,
      html: `
        <h2>New Member Registration</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Role:</strong> ${role}</p>
        <p><strong>Experience:</strong> ${experience}</p>
        <h3>Comments:</h3>
        <p>${comments ? comments.replace(/\n/g, '<br>') : 'No comments'}</p>
        <p><a href="https://cpsclub.com.au/admin/members">View all members →</a></p>
      `,
    });

    return NextResponse.json(
      { success: true, message: 'Registration submitted successfully', memberId: newMember.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Member registration error:', error);
    return NextResponse.json(
      { error: 'Failed to submit registration' },
      { status: 500 }
    );
  }
}
