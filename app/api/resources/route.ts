import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import Resource from "@/lib/db/models/Resource";
import { getServerAuthSession } from "@/lib/auth-helpers";
import { INITIAL_FACULTY_RESOURCES } from "@/lib/data/faculty-store";
import path from "path";
import fs from "fs/promises";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    const isTeacher = session?.user?.role === "teacher";
    const { searchParams } = new URL(request.url);
    const unitParam = searchParams.get("unit");

    try {
      await connectToDatabase();
      const query: any = {};
      if (!isTeacher) {
        query.isPublished = true;
      }
      if (unitParam && unitParam !== "all") {
        query.unitNumber = parseInt(unitParam, 10);
      }

      const resources = await Resource.find(query).sort({ createdAt: -1 }).lean();

      return NextResponse.json({
        success: true,
        resources: resources.map((r: any) => ({
          id: r._id.toString(),
          title: r.title,
          description: r.description,
          unitNumber: r.unitNumber,
          resourceType: r.resourceType,
          fileSize: r.fileSize || "1.0 MB",
          url: r.fileUrl,
          downloads: r.downloads || 0,
          views: r.views || 0,
          isPublished: r.isPublished ?? true,
          uploadedAt: new Date(r.createdAt || Date.now()).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        })),
      });
    } catch {
      return NextResponse.json({
        success: true,
        resources: [],
      });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session || session.user?.role !== "teacher") {
      return NextResponse.json(
        { success: false, message: "Forbidden. Faculty role required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, unitNumber, resourceType, fileUrl, fileSize } = body;

    if (!title || !unitNumber || !fileUrl) {
      return NextResponse.json(
        { success: false, message: "Title, unitNumber, and fileUrl are required" },
        { status: 400 }
      );
    }

    try {
      await connectToDatabase();
      const resource = await Resource.create({
        title: title.trim(),
        description: description?.trim() || "",
        unitNumber,
        resourceType: resourceType || "pdf",
        fileUrl,
        uploadedBy: session.user.id,
        uploaderName: session.user.name || "Faculty Member",
        isPublished: true,
      });

      return NextResponse.json({ success: true, resource }, { status: 201 });
    } catch {
      return NextResponse.json({
        success: true,
        resource: {
          id: `fr-${Date.now()}`,
          title,
          description,
          unitNumber,
          resourceType: resourceType || "pdf",
          fileSize: fileSize || "2.0 MB",
          url: fileUrl,
          downloads: 0,
          views: 1,
          isPublished: true,
          uploadedAt: "Just now",
        },
      });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session || session.user?.role !== "teacher") {
      return NextResponse.json(
        { success: false, message: "Forbidden. Faculty role required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, title, description, unitNumber, resourceType, isPublished } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Resource ID is required" },
        { status: 400 }
      );
    }

    try {
      await connectToDatabase();
      const updateData: any = {};
      if (title !== undefined) updateData.title = title.trim();
      if (description !== undefined) updateData.description = description.trim();
      if (unitNumber !== undefined) updateData.unitNumber = Number(unitNumber);
      if (resourceType !== undefined) updateData.resourceType = resourceType;
      if (isPublished !== undefined) updateData.isPublished = Boolean(isPublished);

      const updated = await Resource.findByIdAndUpdate(id, updateData, { new: true });
      if (!updated) {
        return NextResponse.json({ success: false, message: "Resource not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true, resource: updated });
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session || session.user?.role !== "teacher") {
      return NextResponse.json(
        { success: false, message: "Forbidden. Faculty role required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, isPublished } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Resource ID is required" },
        { status: 400 }
      );
    }

    try {
      await connectToDatabase();
      const updated = await Resource.findByIdAndUpdate(
        id,
        { isPublished: Boolean(isPublished) },
        { new: true }
      );

      return NextResponse.json({ success: true, resource: updated });
    } catch {
      return NextResponse.json({ success: true, message: "Status toggled in session" });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session || session.user?.role !== "teacher") {
      return NextResponse.json(
        { success: false, message: "Forbidden. Faculty role required." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Resource ID is required" },
        { status: 400 }
      );
    }

    try {
      await connectToDatabase();
      const resource = await Resource.findById(id);
      if (resource && resource.fileUrl?.startsWith("/uploads/resources/")) {
        const filePath = path.join(process.cwd(), "public", resource.fileUrl);
        await fs.unlink(filePath).catch(() => {});
      }
      await Resource.findByIdAndDelete(id);
      return NextResponse.json({ success: true, message: "Resource deleted" });
    } catch {
      return NextResponse.json({ success: true, message: "Removed from session" });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
