import { useState, useEffect } from 'react';
import { Video } from '@/types/video';

const STORAGE_KEY = 'video_app_videos';

// Sample videos for demo
const sampleVideos: Video[] = [
  {
    id: '1',
    title: 'Big Buck Bunny',
    description: 'A large and lovable rabbit deals with three bullying rodents.',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=225&fit=crop',
    duration: '9:56',
    uploadedAt: new Date().toISOString(),
    userId: 'demo',
  },
  {
    id: '2',
    title: 'Elephant Dream',
    description: 'The first Blender Open Movie from 2006.',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=225&fit=crop',
    duration: '10:53',
    uploadedAt: new Date().toISOString(),
    userId: 'demo',
  },
];

export const useVideos = (userId: string | undefined) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setVideos([]);
      setIsLoading(false);
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const allVideos: Video[] = JSON.parse(stored);
      setVideos(allVideos.filter(v => v.userId === userId));
    }
    setIsLoading(false);
  }, [userId]);

  const addVideo = (video: Omit<Video, 'id' | 'uploadedAt' | 'userId'>) => {
    if (!userId) return;

    const newVideo: Video = {
      ...video,
      id: crypto.randomUUID(),
      uploadedAt: new Date().toISOString(),
      userId,
    };

    const stored = localStorage.getItem(STORAGE_KEY);
    const allVideos: Video[] = stored ? JSON.parse(stored) : [];
    allVideos.push(newVideo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allVideos));
    setVideos(prev => [...prev, newVideo]);
  };

  const deleteVideo = (videoId: string) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const allVideos: Video[] = JSON.parse(stored);
      const filtered = allVideos.filter(v => v.id !== videoId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      setVideos(prev => prev.filter(v => v.id !== videoId));
    }
  };

  const loadSampleVideos = () => {
    if (!userId) return;

    const userSamples = sampleVideos.map(v => ({
      ...v,
      id: crypto.randomUUID(),
      userId,
      uploadedAt: new Date().toISOString(),
    }));

    const stored = localStorage.getItem(STORAGE_KEY);
    const allVideos: Video[] = stored ? JSON.parse(stored) : [];
    const combined = [...allVideos, ...userSamples];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(combined));
    setVideos(prev => [...prev, ...userSamples]);
  };

  return { videos, isLoading, addVideo, deleteVideo, loadSampleVideos };
};
