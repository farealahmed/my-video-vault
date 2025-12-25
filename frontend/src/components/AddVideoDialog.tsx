import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Link, FileVideo } from 'lucide-react';
import { toast } from 'sonner';

interface AddVideoDialogProps {
  onAdd: (video: { title: string; description: string; file: File; thumbnail: string; duration: string }) => void;
}

const AddVideoDialog = ({ onAdd }: AddVideoDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState('');
  const [duration, setDuration] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !file) {
      toast.error('Title and Video File are required');
      return;
    }

    onAdd({
      title,
      description: description || 'No description',
      file,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop',
      duration: duration || '0:00',
    });

    toast.success('Video upload started!');
    setTitle('');
    setDescription('');
    setFile(null);
    setThumbnail('');
    setDuration('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-primary hover:opacity-90 transition-opacity gap-2">
          <Plus className="w-5 h-5" />
          Add Video
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <FileVideo className="w-5 h-5 text-primary" />
            Add New Video
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Video title"
              className="bg-input border-border"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file" className="flex items-center gap-1">
              <Link className="w-4 h-4" />
              Video File *
            </Label>
            <Input
              id="file"
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              className="bg-input border-border"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail URL</Label>
            <Input
              id="thumbnail"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="https://example.com/thumbnail.jpg"
              className="bg-input border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="5:30"
              className="bg-input border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your video..."
              className="bg-input border-border resize-none"
              rows={3}
            />
          </div>
          <Button type="submit" className="w-full gradient-primary hover:opacity-90">
            Add Video
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVideoDialog;
