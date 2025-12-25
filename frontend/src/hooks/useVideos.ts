import { useState, useEffect, useCallback } from 'react';
import { Video } from '@/types/video';
import { API_BASE_URL } from '@/config';
import { toast } from 'sonner';

export const useVideos = (userId: string | undefined) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVideos = useCallback(async () => {
    if (!userId) {
      setVideos([]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/videos/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setVideos(data);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error('Failed to load videos');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const addVideo = async (videoData: { title: string; description: string; file: File; duration: string }) => {
    if (!userId) return;

    const formData = new FormData();
    formData.append('file', videoData.file);
    formData.append('title', videoData.title);
    formData.append('description', videoData.description);
    formData.append('duration', videoData.duration);
    
    try {
      const response = await fetch(`${API_BASE_URL}/videos/${userId}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newVideo = await response.json();
        setVideos(prev => [...prev, newVideo]);
        toast.success('Video uploaded successfully!');
      } else {
        toast.error('Failed to upload video');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('Error uploading video');
    }
  };

  const deleteVideo = async (videoId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/videos/${videoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setVideos(prev => prev.filter(v => v.id !== videoId));
      } else {
        toast.error('Failed to delete video');
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error('Error deleting video');
    }
  };

  const loadSampleVideos = () => {
    toast.info('Sample videos are disabled in connected mode.');
  };

  return { videos, isLoading, addVideo, deleteVideo, loadSampleVideos };
};
