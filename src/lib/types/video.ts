import { User } from "./user";

export interface Video {
  _id: string;
  title: string;
  description?: string;
  thumbnail: string;
  videoUrl: string;
  duration: number;
  views: number;
  isPublished: boolean;
  owner: User;
  likes: number;
  dislikes: number;
  createdAt: string;
  updatedAt: string;
}

export interface VideoUploadInput {
  title: string;
  description?: string;
  videoFile: File;
  thumbnail: File;
  duration: number;
}

export interface VideoUpdateInput {
  title?: string;
  description?: string;
  thumbnail?: File;
  isPublished?: boolean;
}
