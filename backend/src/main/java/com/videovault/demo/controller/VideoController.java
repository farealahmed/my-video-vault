package com.videovault.demo.controller;

import com.videovault.demo.model.User;
import com.videovault.demo.model.Video;
import com.videovault.demo.repository.UserRepository;
import com.videovault.demo.repository.VideoRepository;
import com.videovault.demo.service.FileStorageService;
import com.videovault.demo.service.VideoProcessingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/videos")
public class VideoController {

    private final VideoRepository videoRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final VideoProcessingService videoProcessingService;

    public VideoController(VideoRepository videoRepository, UserRepository userRepository,
                          FileStorageService fileStorageService, VideoProcessingService videoProcessingService) {
        this.videoRepository = videoRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
        this.videoProcessingService = videoProcessingService;
    }

    @GetMapping("/{userId}")
    public List<Video> getUserVideos(@PathVariable String userId) {
        return videoRepository.findByUserId(userId);
    }

    @PostMapping("/{userId}")
    public ResponseEntity<Video> uploadVideo(
            @PathVariable String userId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "duration", required = false) String duration) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String originalFileName = file.getOriginalFilename();
        String fileName = fileStorageService.storeFile(file);

        // Auto-extract title from filename if not provided
        String videoTitle = (title != null && !title.isBlank())
            ? title
            : videoProcessingService.extractTitle(originalFileName);

        // Auto-extract duration using FFmpeg if not provided
        String videoDuration = (duration != null && !duration.isBlank())
            ? duration
            : videoProcessingService.extractDuration(fileName);

        // Generate thumbnail using FFmpeg
        String thumbnailPath = videoProcessingService.generateThumbnail(fileName);
        String thumbnailUrl;
        if (thumbnailPath != null) {
            thumbnailUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/")
                .path(thumbnailPath)
                .toUriString();
        } else {
            thumbnailUrl = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop";
        }

        // Create the download URL
        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/")
                .path(fileName)
                .toUriString();

        Video video = new Video();
        video.setTitle(videoTitle);
        video.setDescription(description != null ? description : "");
        video.setDuration(videoDuration);
        video.setUrl(fileDownloadUri);
        video.setThumbnail(thumbnailUrl);
        video.setUser(user);

        return ResponseEntity.ok(videoRepository.save(video));
    }

    @DeleteMapping("/{videoId}")
    public ResponseEntity<?> deleteVideo(@PathVariable String videoId) {
        System.out.println("Delete request for video ID: " + videoId);
        Video video = videoRepository.findById(videoId).orElse(null);
        if (video != null) {
            // Extract file name from URL (e.g., http://localhost:8080/uploads/uuid_filename.mp4 -> uuid_filename.mp4)
            String videoUrl = video.getUrl();
            System.out.println("Video URL: " + videoUrl);
            if (videoUrl != null && videoUrl.contains("/uploads/")) {
                String fileName = videoUrl.substring(videoUrl.lastIndexOf("/uploads/") + 9);
                // URL decode to handle spaces and special characters
                fileName = URLDecoder.decode(fileName, StandardCharsets.UTF_8);
                System.out.println("Deleting video file: " + fileName);
                fileStorageService.deleteFile(fileName);
            }

            // Extract thumbnail path from URL and delete it
            String thumbnailUrl = video.getThumbnail();
            System.out.println("Thumbnail URL: " + thumbnailUrl);
            if (thumbnailUrl != null && thumbnailUrl.contains("/uploads/")) {
                String thumbnailPath = thumbnailUrl.substring(thumbnailUrl.lastIndexOf("/uploads/") + 9);
                // URL decode to handle spaces and special characters
                thumbnailPath = URLDecoder.decode(thumbnailPath, StandardCharsets.UTF_8);
                System.out.println("Deleting thumbnail: " + thumbnailPath);
                fileStorageService.deleteThumbnail(thumbnailPath);
            }

            videoRepository.deleteById(videoId);
            System.out.println("Video deleted from database");
        } else {
            System.out.println("Video not found in database");
        }
        return ResponseEntity.ok().build();
    }
}
