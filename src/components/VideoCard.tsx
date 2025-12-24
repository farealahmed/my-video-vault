import { Video } from '@/types/video';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Trash2, Clock } from 'lucide-react';

interface VideoCardProps {
  video: Video;
  onPlay: (video: Video) => void;
  onDelete: (videoId: string) => void;
}

const VideoCard = ({ video, onPlay, onDelete }: VideoCardProps) => {
  return (
    <Card className="group overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-glow">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="lg"
            className="gradient-primary shadow-glow rounded-full w-14 h-14"
            onClick={() => onPlay(video)}
          >
            <Play className="w-6 h-6 fill-current" />
          </Button>
        </div>
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-xs font-medium text-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {video.duration}
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{video.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {video.description}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(video.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
