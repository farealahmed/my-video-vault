package com.videovault.demo.controller;

import com.videovault.demo.model.User;
import com.videovault.demo.model.Video;
import com.videovault.demo.repository.UserRepository;
import com.videovault.demo.repository.VideoRepository;
import com.videovault.demo.service.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;

@RestController
@RequestMapping("/api/videos")
public class VideoController {

    private final VideoRepository videoRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public VideoController(VideoRepository videoRepository, UserRepository userRepository, FileStorageService fileStorageService) {
        this.videoRepository = videoRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/{userId}")
    public List<Video> getUserVideos(@PathVariable String userId) {
        return videoRepository.findByUserId(userId);
    }

    @PostMapping("/{userId}")
    public ResponseEntity<Video> uploadVideo(
            @PathVariable String userId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("duration") String duration) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String fileName = fileStorageService.storeFile(file);

        // Create the download URL (e.g., http://localhost:8080/uploads/filename.mp4)
        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/")
                .path(fileName)
                .toUriString();

        Video video = new Video();
        video.setTitle(title);
        video.setDescription(description);
        video.setDuration(duration);
        video.setUrl(fileDownloadUri); // Store the URL, not the file
        video.setThumbnail("https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop"); // Default for now
        video.setUser(user);

        return ResponseEntity.ok(videoRepository.save(video));
    }

    @DeleteMapping("/{videoId}")
    public ResponseEntity<?> deleteVideo(@PathVariable String videoId) {
        videoRepository.deleteById(videoId);
        return ResponseEntity.ok().build();
    }
}
