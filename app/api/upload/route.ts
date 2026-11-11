import { NextRequest, NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth-helpers";
import { connectToDatabase } from "@/lib/db/connect";
import Resource from "@/lib/db/models/Resource";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

const ALLOWED_EXTENSIONS = new Set([
  ".pdf",
  ".ppt",
  ".pptx",
  ".doc",
  ".docx",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
]);

const MIME_TO_RESOURCE_TYPE: Record<string, "pdf" | "ppt" | "doc" | "image"> = {
  "application/pdf": "pdf",
  "application/vnd.ms-powerpoint": "ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "ppt",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "doc",
  "image/jpeg": "image",
  "image/png": "image",
  "image/webp": "image",
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session || session.user?.role !== "teacher") {
      return NextResponse.json(
        { success: false, message: "Forbidden. Faculty role required." },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string | null)?.trim();
    const description = ((formData.get("description") as string | null) || "").trim();
    const unitNumberRaw = formData.get("unitNumber") as string | null;
    const unitNumber = unitNumberRaw ? parseInt(unitNumberRaw, 10) : 1;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          message: `File size exceeds the 25MB limit (provided ${Math.round(file.size / (1024 * 1024))}MB)`,
        },
        { status: 400 }
      );
    }

    const originalName = file.name || "unnamed";
    const ext = path.extname(originalName).toLowerCase();

    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        {
          success: false,
          message: `Unsupported file format '${ext}'. Allowed: PDF, PPT, PPTX, DOC, DOCX, JPG, PNG, WEBP.`,
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const safeBaseName = path
      .basename(originalName, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 40);
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
    const sanitizedFileName = `${safeBaseName}-${uniqueSuffix}${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads", "resources");
    await fs.mkdir(uploadDir, { recursive: true });

    const targetFilePath = path.join(uploadDir, sanitizedFileName);
    await fs.writeFile(targetFilePath, buffer);

    const publicUrl = `/uploads/resources/${sanitizedFileName}`;

    // Determine resource type
    const resourceType =
      MIME_TO_RESOURCE_TYPE[file.type] ||
      (ext.startsWith(".ppt")
        ? "ppt"
        : ext.startsWith(".doc")
        ? "doc"
        : ext === ".pdf"
        ? "pdf"
        : "image");

    let createdResource = null;
    if (title) {
      try {
        await connectToDatabase();
        createdResource = await Resource.create({
          title,
          description,
          unitNumber,
          resourceType,
          fileUrl: publicUrl,
          fileSizeBytes: file.size,
          mimeType: file.type || "application/octet-stream",
          uploadedBy: session.user.id,
          uploaderName: session.user.name || "Faculty Member",
          isPublished: true,
        });
      } catch (dbErr: any) {
        console.warn("Database save skipped during file upload:", dbErr.message);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "File uploaded successfully",
        fileUrl: publicUrl,
        fileName: sanitizedFileName,
        fileSizeBytes: file.size,
        mimeType: file.type,
        resourceType,
        resource: createdResource,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}

