import { NextRequest, NextResponse } from "next/server";

// TODO: Replace with real database/authentication service
// This is a mock implementation for demonstration

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

// Mock user database (replace with real database)
const MOCK_USERS = [
  {
    id: "1",
    email: "user@example.com",
    password: "password123", // In production, use hashed passwords!
    name: "John Doe",
  },
  {
    id: "2",
    email: "player@cpsclub.com",
    password: "playpass123",
    name: "Cricket Player",
  },
];

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user (in production, query your database)
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate a mock JWT token (in production, use a proper JWT library)
    const token = Buffer.from(
      JSON.stringify({
        userId: user.id,
        email: user.email,
        iat: Date.now(),
      })
    ).toString("base64");

    // Return user data and token
    const response: LoginResponse = {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
