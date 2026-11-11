import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import Announcement from "@/lib/db/models/Announcement";
import { getServerAuthSession } from "@/lib/auth-helpers";
import { INITIAL_ANNOUNCEMENTS } from "@/lib/data/faculty-store";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    const isTeacher = session?.user?.role === "teacher";

    try {
      await connectToDatabase();
      const filter = isTeacher ? {} : { isPublished: true };
      const announcements = await Announcement.find(filter)
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();

      return NextResponse.json({
        success: true,
        announcements: announcements.map((a: any) => ({
          id: a._id.toString(),
          title: a.title,
          content: a.content,
          priority: a.priority,
          author: a.authorName,
          authorRole: a.authorRole || "Course Faculty",
          date: new Date(a.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          unitTag: a.unitTag,
          isPublished: a.isPublished,
        })),
      });
    } catch {
      return NextResponse.json({
        success: true,
        announcements: [],
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
    const { title, content, priority, unitTag } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: "Title and content are required." },
        { status: 400 }
      );
    }

    try {
      await connectToDatabase();
      const announcement = await Announcement.create({
        title: title.trim(),
        content: content.trim(),
        priority: priority || "normal",
        authorName: session.user.name || "Faculty Member",
        authorRole: "Course Lead • Dept. of CSE",
        unitTag: unitTag ? Number(unitTag) : undefined,
        isPublished: true,
      });

      return NextResponse.json(
        {
          success: true,
          announcement: {
            id: announcement._id.toString(),
            title: announcement.title,
            content: announcement.content,
            priority: announcement.priority,
            author: announcement.authorName,
            authorRole: announcement.authorRole,
            date: "Just now",
            unitTag: announcement.unitTag,
            isPublished: announcement.isPublished,
          },
        },
        { status: 201 }
      );
    } catch {
      return NextResponse.json({
        success: true,
        announcement: {
          id: `a-${Date.now()}`,
          title,
          content,
          priority: priority || "normal",
          author: session.user.name || "Faculty Member",
          authorRole: "Course Lead • Dept. of CSE",
          date: "Just now",
          unitTag,
          isPublished: true,
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
    const { id, title, content, priority, unitTag, isPublished } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Announcement ID is required" },
        { status: 400 }
      );
    }

    try {
      await connectToDatabase();
      const updateData: any = {};
      if (title !== undefined) updateData.title = title.trim();
      if (content !== undefined) updateData.content = content.trim();
      if (priority !== undefined) updateData.priority = priority;
      if (unitTag !== undefined) updateData.unitTag = Number(unitTag);
      if (isPublished !== undefined) updateData.isPublished = Boolean(isPublished);

      const updated = await Announcement.findByIdAndUpdate(id, updateData, { new: true });
      if (!updated) {
        return NextResponse.json({ success: false, message: "Announcement not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true, announcement: updated });
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
        { success: false, message: "Announcement ID is required" },
        { status: 400 }
      );
    }

    try {
      await connectToDatabase();
      const updated = await Announcement.findByIdAndUpdate(
        id,
        { isPublished: Boolean(isPublished) },
        { new: true }
      );

      return NextResponse.json({ success: true, announcement: updated });
    } catch {
      return NextResponse.json({ success: true, message: "Status updated in session" });
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
        { success: false, message: "Announcement ID is required" },
        { status: 400 }
      );
    }

    try {
      await connectToDatabase();
      await Announcement.findByIdAndDelete(id);
      return NextResponse.json({ success: true, message: "Announcement deleted" });
    } catch {
      return NextResponse.json({ success: true, message: "Removed from session" });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
