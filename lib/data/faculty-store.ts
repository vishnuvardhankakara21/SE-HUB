export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  priority: "exam" | "urgent" | "normal";
  author: string;
  authorRole: string;
  date: string;
  unitTag?: number;
}

export interface FacultyResourceItem {
  id: string;
  title: string;
  description: string;
  unitNumber: number;
  resourceType: "pdf" | "ppt" | "video_link" | "image" | "xml";
  fileSize?: string;
  url: string;
  downloads: number;
  views: number;
  isPublished: boolean;
  uploadedAt: string;
}

export const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [];

export const INITIAL_FACULTY_RESOURCES: FacultyResourceItem[] = [];


