import { Video } from '@/types/video';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface VideoPlayerProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
}

const VideoPlayer = ({ video, isOpen, onClose }: VideoPlayerProps) => {
  if (!video) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 bg-card border-border overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-xl font-bold text-foreground">
            {video.title}
          </DialogTitle>
        </DialogHeader>
        <div className="aspect-video bg-background">
          <video
            src={video.url}
            controls
            autoPlay
            className="w-full h-full"
          >
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="p-4 pt-2">
          <p className="text-muted-foreground">{video.description}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayer;
