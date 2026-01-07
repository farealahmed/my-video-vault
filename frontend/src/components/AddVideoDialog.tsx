import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Upload, FileVideo, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AddVideoDialogProps {
  onAdd: (video: { title: string; description: string; file: File; duration: string }) => void;
}

const AddVideoDialog = ({ onAdd }: AddVideoDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setFile(null);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetForm();
    }
  };

  const extractTitleFromFilename = (filename: string): string => {
    // Remove file extension
    let title = filename.replace(/\.[^.]+$/, '');
    // Replace underscores and hyphens with spaces
    title = title.replace(/[_-]/g, ' ');
    // Capitalize first letter of each word
    title = title.replace(/\b\w/g, (char) => char.toUpperCase());
    return title;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);

    // Auto-populate title from filename if title is empty
    if (selectedFile && !title) {
      setTitle(extractTitleFromFilename(selectedFile.name));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please select a video file');
      return;
    }

    setIsUploading(true);

    try {
      await onAdd({
        title: title || extractTitleFromFilename(file.name),
        description: description || '',
        file,
        duration: '', // Backend will extract this automatically
      });

      toast.success('Video uploaded successfully!');
      setTitle('');
      setDescription('');
      setFile(null);
      setOpen(false);
    } catch {
      toast.error('Failed to upload video');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
            <Label htmlFor="file" className="flex items-center gap-1">
              <Upload className="w-4 h-4" />
              Video File *
            </Label>
            <Input
              id="file"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="bg-input border-border file:hidden text-muted-foreground cursor-pointer"
              required
              disabled={isUploading}
            />
            {file && (
              <p className="text-sm text-muted-foreground">
                Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title (auto-filled from filename)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Video title"
              className="bg-input border-border"
              disabled={isUploading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your video..."
              className="bg-input border-border resize-none"
              rows={3}
              disabled={isUploading}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Duration and thumbnail will be extracted automatically from the video.
          </p>
          <Button
            type="submit"
            className="w-full gradient-primary hover:opacity-90"
            disabled={isUploading || !file}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload Video'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVideoDialog;
