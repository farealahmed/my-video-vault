package com.videovault.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.TimeUnit;

@Service
public class VideoProcessingService {

    private final Path uploadDir;
    private final Path thumbnailDir;

    public VideoProcessingService(@Value("${file.upload-dir:uploads}") String uploadDir) {
        this.uploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.thumbnailDir = this.uploadDir.resolve("thumbnails");

        try {
            Files.createDirectories(this.thumbnailDir);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create thumbnails directory", ex);
        }
    }

    public String extractDuration(String videoFileName) {
        try {
            Path videoPath = uploadDir.resolve(videoFileName);

            ProcessBuilder pb = new ProcessBuilder(
                "ffprobe",
                "-v", "error",
                "-show_entries", "format=duration",
                "-of", "default=noprint_wrappers=1:nokey=1",
                videoPath.toString()
            );
            pb.redirectErrorStream(true);

            Process process = pb.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String output = reader.readLine();
            process.waitFor(30, TimeUnit.SECONDS);

            if (output != null && !output.isEmpty()) {
                double seconds = Double.parseDouble(output.trim());
                return formatDuration((long) seconds);
            }
        } catch (Exception e) {
            System.err.println("Error extracting duration: " + e.getMessage());
        }
        return "00:00";
    }

    public String generateThumbnail(String videoFileName) {
        try {
            Path videoPath = uploadDir.resolve(videoFileName);
            String thumbnailFileName = videoFileName.replaceAll("\\.[^.]+$", "") + ".jpg";
            Path thumbnailPath = thumbnailDir.resolve(thumbnailFileName);

            // Extract frame at 1 second (or first frame if video is shorter)
            ProcessBuilder pb = new ProcessBuilder(
                "ffmpeg",
                "-y",
                "-i", videoPath.toString(),
                "-ss", "00:00:01",
                "-vframes", "1",
                "-vf", "scale=400:-1",
                "-q:v", "2",
                thumbnailPath.toString()
            );
            pb.redirectErrorStream(true);

            Process process = pb.start();
            // Consume output to prevent blocking
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            while (reader.readLine() != null) {}

            boolean completed = process.waitFor(60, TimeUnit.SECONDS);

            if (completed && Files.exists(thumbnailPath)) {
                return "thumbnails/" + thumbnailFileName;
            }
        } catch (Exception e) {
            System.err.println("Error generating thumbnail: " + e.getMessage());
        }
        return null;
    }

    public String extractTitle(String originalFileName) {
        if (originalFileName == null || originalFileName.isEmpty()) {
            return "Untitled Video";
        }
        // Remove file extension and clean up the name
        String title = originalFileName.replaceAll("\\.[^.]+$", "");
        // Replace underscores and hyphens with spaces
        title = title.replaceAll("[_-]", " ");
        // Capitalize first letter of each word
        String[] words = title.split("\\s+");
        StringBuilder result = new StringBuilder();
        for (String word : words) {
            if (!word.isEmpty()) {
                result.append(Character.toUpperCase(word.charAt(0)))
                      .append(word.substring(1).toLowerCase())
                      .append(" ");
            }
        }
        return result.toString().trim();
    }

    private String formatDuration(long totalSeconds) {
        long hours = totalSeconds / 3600;
        long minutes = (totalSeconds % 3600) / 60;
        long seconds = totalSeconds % 60;

        if (hours > 0) {
            return String.format("%d:%02d:%02d", hours, minutes, seconds);
        }
        return String.format("%02d:%02d", minutes, seconds);
    }

    public boolean isFFmpegAvailable() {
        try {
            ProcessBuilder pb = new ProcessBuilder("ffmpeg", "-version");
            Process process = pb.start();
            return process.waitFor(5, TimeUnit.SECONDS) && process.exitValue() == 0;
        } catch (Exception e) {
            return false;
        }
    }
}
