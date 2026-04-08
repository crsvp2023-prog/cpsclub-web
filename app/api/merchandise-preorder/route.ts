import { NextRequest, NextResponse } from "next/server";
import { admin, db } from "@/app/lib/firebase-admin";
import { Resend } from "resend";

export const runtime = "nodejs";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const PRICE = {
  jersey: 25,
  trouser: 30,
  hat: 14,
} as const;

function toSafeNumber(value: unknown) {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? Math.floor(num) : 0;
}

function generateUniqueId() {
  return String(Date.now() % 10000).padStart(4, "0");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email = String(body?.email || "").trim().toLowerCase();
    const phone = String(body?.phone || "").trim();
    const playerRegistration = String(body?.playerRegistration || "New Player").trim();

    const jerseySize = String(body?.jerseySize || "").trim();
    const trouserSize = String(body?.trouserSize || "").trim();

    const jerseyQuantity = toSafeNumber(body?.jerseyQuantity);
    const trouserQuantity = toSafeNumber(body?.trouserQuantity);
    const hatsQuantity = toSafeNumber(body?.hatsQuantity);

    if (!email || !phone) {
      return NextResponse.json(
        { error: "Email and phone number are required" },
        { status: 400 }
      );
    }

    if (jerseyQuantity <= 0 && trouserQuantity <= 0 && hatsQuantity <= 0) {
      return NextResponse.json(
        { error: "Please order at least one product" },
        { status: 400 }
      );
    }

    if (jerseyQuantity > 0 && !jerseySize) {
      return NextResponse.json(
        { error: "Please select jersey size" },
        { status: 400 }
      );
    }

    if (trouserQuantity > 0 && !trouserSize) {
      return NextResponse.json(
        { error: "Please select trouser size" },
        { status: 400 }
      );
    }

    const totalJerseys = jerseyQuantity;
    const totalTrousers = trouserQuantity;

    const jerseyTotal = totalJerseys * PRICE.jersey;
    const trouserTotal = totalTrousers * PRICE.trouser;
    const hatsTotal = hatsQuantity * PRICE.hat;
    const orderTotal = jerseyTotal + trouserTotal + hatsTotal;

    const uniqueId = generateUniqueId();

    const docRef = await db.collection("merchandise_preorders").add({
      uniqueId,
      email,
      phone,
      playerRegistration,
      products: {
        jersey: {
          size: jerseySize || null,
          quantity: jerseyQuantity,
          unitPrice: PRICE.jersey,
          total: jerseyTotal,
        },
        trouser: {
          size: trouserSize || null,
          quantity: trouserQuantity,
          unitPrice: PRICE.trouser,
          total: trouserTotal,
        },
        hat: {
          quantity: hatsQuantity,
          unitPrice: PRICE.hat,
          total: hatsTotal,
        },
      },
      totals: {
        totalJerseys,
        totalTrousers,
        hatsQuantity,
        orderTotal,
      },
      createdByUid: body?.userUid || null,
      status: "submitted",
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    let emailSent = false;
    try {
      if (resend) {
        const productSummary = [
          totalJerseys > 0 ? `Jersey (${jerseySize}) x ${totalJerseys}` : null,
          totalTrousers > 0 ? `Trouser (${trouserSize}) x ${totalTrousers}` : null,
          hatsQuantity > 0 ? `Hat x ${hatsQuantity}` : null,
        ]
          .filter(Boolean)
          .join(", ");

        await resend.emails.send({
          from: "noreply@resend.dev",
          to: "crsvp.2023@gmail.com",
          subject: `New CPSC Winter Pre-Order #${uniqueId}`,
          html: `
            <h2>New Merchandise Pre-Order</h2>
            <p><strong>Unique ID:</strong> ${uniqueId}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Player Registration:</strong> ${playerRegistration}</p>
            <p><strong>Products:</strong> ${productSummary || "None"}</p>
            <p><strong>Total Jerseys:</strong> ${totalJerseys}</p>
            <p><strong>Total Trousers:</strong> ${totalTrousers}</p>
            <p><strong>Total Hats:</strong> ${hatsQuantity}</p>
            <p><strong>Order Total:</strong> $${orderTotal}</p>
            <p><strong>Firestore ID:</strong> ${docRef.id}</p>
          `,
        });

        await resend.emails.send({
          from: "noreply@resend.dev",
          to: email,
          subject: `CPSC 2026 Winter Pre-Order Confirmation #${uniqueId}`,
          html: `
            <h2>Pre-Order Confirmation</h2>
            <p>Thank you for your order. Your pre-order has been received.</p>
            <p><strong>Unique ID:</strong> ${uniqueId}</p>
            <p><strong>Order Total:</strong> $${orderTotal}</p>
            <p>We will contact you soon with next steps.</p>
          `,
        });

        emailSent = true;
      } else {
        console.warn("RESEND_API_KEY is not set. Skipping merchandise pre-order email.");
      }
    } catch (emailError) {
      console.error("Failed to send merchandise pre-order email:", emailError);
    }

    return NextResponse.json({
      success: true,
      id: docRef.id,
      uniqueId,
      emailSent,
      summary: {
        totalJerseys,
        totalTrousers,
        hatsQuantity,
        orderTotal,
      },
      message: "Pre-order submitted successfully",
    });
  } catch (error) {
    console.error("Merchandise preorder error:", error);
    return NextResponse.json(
      { error: "Failed to submit pre-order" },
      { status: 500 }
    );
  }
}
