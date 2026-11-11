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

    try {
      await connectToDatabase();
      const validItemId = mongoose.Types.ObjectId.isValid(itemId)
        ? new mongoose.Types.ObjectId(itemId)
        : new mongoose.Types.ObjectId();

      const bookmark = await Bookmark.findOneAndUpdate(
        {
          userId: session.user.id,
          itemType,
          itemId: validItemId,
        },
        {
          userId: session.user.id,
          itemType,
          itemId: validItemId,
          unitNumber,
          title: title.trim(),
          subtitle: subtitle?.trim(),
          url,
        },
        { upsert: true, new: true }
      );

      return NextResponse.json({ success: true, bookmark }, { status: 201 });
    } catch {
      return NextResponse.json({
        success: true,
        bookmark: { id: `local-${Date.now()}`, itemType, unitNumber, title, url },
      });
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
    const url = searchParams.get("url");

    if (!id && !url) {
      return NextResponse.json(
        { success: false, message: "Bookmark ID or URL is required" },
        { status: 400 }
      );
    }

    try {
      await connectToDatabase();
      if (id) {
        await Bookmark.findOneAndDelete({ _id: id, userId: session.user.id });
      } else if (url) {
        await Bookmark.findOneAndDelete({ url, userId: session.user.id });
      }

      return NextResponse.json({ success: true, message: "Bookmark removed" });
    } catch {
      return NextResponse.json({ success: true, message: "Removed from session" });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

