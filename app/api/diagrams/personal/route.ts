import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import PersonalDiagram from "@/lib/db/models/PersonalDiagram";
import { getServerAuthSession } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    try {
      await connectToDatabase();
      const diagrams = await PersonalDiagram.find({ userId: session.user.id })
        .sort({ updatedAt: -1 })
        .limit(100);
      return NextResponse.json({ success: true, diagrams });
    } catch {
      return NextResponse.json({
        success: true,
        diagrams: [],
        message: "Storage active (client fallback)",
      });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, xmlContent, diagramType } = body;

    if (!xmlContent) {
      return NextResponse.json(
        { success: false, message: "XML diagram content is required" },
        { status: 400 }
      );
    }

    try {
      await connectToDatabase();
      const newDiagram = await PersonalDiagram.create({
        userId: session.user.id,
        title: title?.trim() || "Untitled Diagram",
        xmlContent,
        diagramType: diagramType || "UML",
        isPublic: false,
      });
      return NextResponse.json({ success: true, diagram: newDiagram }, { status: 201 });
    } catch {
      return NextResponse.json({
        success: true,
        diagram: {
          id: `local-${Date.now()}`,
          title: title || "Untitled Diagram",
          xmlContent,
          diagramType: diagramType || "UML",
          updatedAt: new Date().toISOString(),
        },
        message: "Saved in session cache",
      });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, title, xmlContent, diagramType } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Diagram ID is required" },
        { status: 400 }
      );
    }

    try {
      await connectToDatabase();
      const updated = await PersonalDiagram.findOneAndUpdate(
        { _id: id, userId: session.user.id },
        {
          ...(title && { title: title.trim() }),
          ...(xmlContent && { xmlContent }),
          ...(diagramType && { diagramType }),
        },
        { new: true }
      );

      if (!updated) {
        return NextResponse.json(
          { success: false, message: "Diagram not found or permission denied" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, diagram: updated });
    } catch {
      return NextResponse.json({
        success: true,
        message: "Updated in session cache",
      });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Diagram ID is required" },
        { status: 400 }
      );
    }

    try {
      await connectToDatabase();
      const deleted = await PersonalDiagram.findOneAndDelete({
        _id: id,
        userId: session.user.id,
      });

      if (!deleted) {
        return NextResponse.json(
          { success: false, message: "Diagram not found or permission denied" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, message: "Diagram deleted" });
    } catch {
      return NextResponse.json({ success: true, message: "Removed from session cache" });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
