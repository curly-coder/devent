import { Event, IEvent } from "@/database";
import dbConnect from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

// Type for route params in Next.js App Router dynamic routes
interface RouteParams {
  params: Promise<{ slug: string }>;
}

// Standardized API response types
interface SuccessResponse {
  message: string;
  event: IEvent;
}

interface ErrorResponse {
  message: string;
  error?: string;
}

/**
 * Validates the slug parameter format.
 * Slugs should be URL-safe: lowercase alphanumeric with hyphens.
 */
function isValidSlug(slug: string): boolean {
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugPattern.test(slug);
}

/**
 * GET /api/events/[slug]
 * Retrieves a single event by its unique slug identifier.
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    const { slug } = await params;

    // Validate slug presence
    if (!slug || slug.trim() === "") {
      return NextResponse.json(
        { message: "Slug parameter is required" },
        { status: 400 }
      );
    }

    // Validate slug format
    if (!isValidSlug(slug)) {
      return NextResponse.json(
        { message: "Invalid slug format. Slug must be URL-safe (lowercase alphanumeric with hyphens)." },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Query event by slug
    const event = await Event.findOne({ slug }).lean<IEvent>();

    // Handle event not found
    if (!event) {
      return NextResponse.json(
        { message: `Event with slug '${slug}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Event retrieved successfully", event },
      { status: 200 }
    );
  } catch (error) {
    // Log error for server-side debugging
    console.error("[GET /api/events/[slug]] Error:", error);

    return NextResponse.json(
      {
        message: "Failed to retrieve event",
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
