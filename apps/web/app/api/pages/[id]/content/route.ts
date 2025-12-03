import { NextResponse } from "next/server";
import type { JSONContent } from "novel";

// Using nodejs runtime for better compatibility with dynamic routes
// Change to "edge" if needed, but params handling may differ
export const runtime = "nodejs";

interface SaveContentRequest {
  content: JSONContent;
  html?: string;
  markdown?: string;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
): Promise<Response> {
  try {
    // In Next.js 16, params can be a Promise that needs to be awaited
    const resolvedParams = await Promise.resolve(params);
    const pageId = resolvedParams?.id;
    
    if (!pageId) {
      return NextResponse.json(
        { error: "Page ID is required" },
        { status: 400 }
      );
    }

    let body: SaveContentRequest;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json(
        { 
          error: "Invalid JSON in request body",
          details: error instanceof Error ? error.message : "Unknown error"
        },
        { status: 400 }
      );
    }
    
    // Validate content exists and is an object
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { 
          error: "Request body is required",
          received: typeof body
        },
        { status: 400 }
      );
    }

    // Validate content - it should be an object (can be empty object)
    if (body.content === null || body.content === undefined) {
      return NextResponse.json(
        { 
          error: "Content is required",
          received: body.content === null ? "null" : "undefined"
        },
        { status: 400 }
      );
    }

    // Content should be an object, not an array or primitive
    if (typeof body.content !== "object" || Array.isArray(body.content)) {
      return NextResponse.json(
        { 
          error: "Content must be a valid JSON object",
          received: Array.isArray(body.content) ? "array" : typeof body.content
        },
        { status: 400 }
      );
    }

    // Here you would typically save to your backend database
    // For now, we'll return the data structure that backend developers should expect
    const responseData = {
      success: true,
      pageId,
      content: body.content,
      html: body.html || null,
      markdown: body.markdown || null,
      savedAt: new Date().toISOString(),
    };

    // TODO: Replace this with actual backend API call
    // Example:
    // const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/pages/${pageId}/content`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ content: body.content, html: body.html, markdown: body.markdown })
    // });
    // const result = await backendResponse.json();

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Error saving page content:", error);
    return NextResponse.json(
      { error: "Failed to save page content" },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve page content
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
): Promise<Response> {
  try {
    // In Next.js 16, params can be a Promise that needs to be awaited
    const resolvedParams = await Promise.resolve(params);
    const pageId = resolvedParams?.id;
    
    if (!pageId) {
      return NextResponse.json(
        { error: "Page ID is required" },
        { status: 400 }
      );
    }

    // TODO: Replace this with actual backend API call
    // Example:
    // const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/pages/${pageId}/content`);
    // const result = await backendResponse.json();
    // return NextResponse.json(result);

    // For now, return empty content structure
    return NextResponse.json({
      pageId,
      content: null,
      message: "Backend integration needed - implement GET endpoint in your backend",
    });
  } catch (error) {
    console.error("Error fetching page content:", error);
    return NextResponse.json(
      { error: "Failed to fetch page content" },
      { status: 500 }
    );
  }
}

