export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration: string;
  uploadedAt: string;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}
