import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/components/AuthContext';
import { useVideos } from '@/hooks/useVideos';
import { Video } from '@/types/video';
import VideoCard from '@/components/VideoCard';
import VideoPlayer from '@/components/VideoPlayer';
import AddVideoDialog from '@/components/AddVideoDialog';
import { Button } from '@/components/ui/button';
import { Play, LogOut, Film, Download, User } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, logout } = useAuthContext();
  const { videos, isLoading: videosLoading, addVideo, deleteVideo, loadSampleVideos } = useVideos(user?.id);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const handlePlay = (video: Video) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
  };

  const handleDelete = (videoId: string) => {
    deleteVideo(videoId);
    toast.success('Video deleted');
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (authLoading || videosLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-2 text-primary">
          <Film className="w-8 h-8 animate-spin" />
          <span className="text-xl font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <header className="relative border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg gradient-primary shadow-glow">
                <Play className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">StreamVault</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Your Videos</h2>
            <p className="text-muted-foreground mt-1">
              {videos.length} video{videos.length !== 1 ? 's' : ''} in your library
            </p>
          </div>
          <div className="flex items-center gap-3">
            {videos.length === 0 && (
              <Button variant="outline" onClick={loadSampleVideos} className="gap-2 border-border">
                <Download className="w-4 h-4" />
                Load Sample Videos
              </Button>
            )}
            <AddVideoDialog onAdd={addVideo} />
          </div>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-muted mb-6">
              <Film className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">No videos yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Start building your video library by adding videos or loading some samples to explore.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" onClick={loadSampleVideos} className="gap-2 border-border">
                <Download className="w-4 h-4" />
                Load Sample Videos
              </Button>
              <AddVideoDialog onAdd={addVideo} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onPlay={handlePlay}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      <VideoPlayer
        video={selectedVideo}
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
