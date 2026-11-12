import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import Bookmark from "@/lib/db/models/Bookmark";
import { getServerAuthSession } from "@/lib/auth-helpers";
import mongoose from "mongoose";

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
      const bookmarks = await Bookmark.find({ userId: session.user.id })
        .sort({ createdAt: -1 })
        .lean();
      return NextResponse.json({ success: true, bookmarks });
    } catch {
      return NextResponse.json({ success: true, bookmarks: [] });
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
    const { itemType, itemId, unitNumber, title, subtitle, url } = body;

    if (!itemType || !unitNumber || !title || !url) {
      return NextResponse.json(
        { success: false, message: "itemType, unitNumber, title, and url are required" },
        { status: 400 }
      );
    }

    const cleanItemId = String(itemId || url);

    try {
      await connectToDatabase();
      const bookmark = await Bookmark.findOneAndUpdate(
        {
          userId: session.user.id,
          $or: [{ itemId: cleanItemId }, { url }],
        },
        {
          userId: session.user.id,
          itemType,
          itemId: cleanItemId,
          unitNumber: Number(unitNumber),
          title: title.trim(),
          subtitle: subtitle?.trim(),
          url,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      return NextResponse.json({ success: true, bookmark }, { status: 201 });
    } catch (err: any) {
      console.error("Error creating bookmark:", err);
      return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
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
    const itemId = searchParams.get("itemId");
    const url = searchParams.get("url");

    if (!id && !itemId && !url) {
      return NextResponse.json(
        { success: false, message: "Bookmark ID, itemId, or URL is required" },
        { status: 400 }
      );
    }

    try {
      await connectToDatabase();

      const orConditions: any[] = [];
      if (id && mongoose.Types.ObjectId.isValid(id)) {
        orConditions.push({ _id: id });
      }
      if (id) {
        orConditions.push({ itemId: id });
      }
      if (itemId) {
        orConditions.push({ itemId });
      }
      if (url) {
        orConditions.push({ url });
      }

      await Bookmark.deleteMany({
        userId: session.user.id,
        $or: orConditions,
      });

      return NextResponse.json({ success: true, message: "Bookmark removed" });
    } catch (err: any) {
      console.error("Error deleting bookmark:", err);
      return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

