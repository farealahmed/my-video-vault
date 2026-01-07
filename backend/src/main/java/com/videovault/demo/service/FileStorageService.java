package com.videovault.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    public FileStorageService(@Value("${file.upload-dir:uploads}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        // Normalize file name
        String originalFileName = file.getOriginalFilename();
        // Generate a unique file name to avoid collisions
        String fileName = UUID.randomUUID().toString() + "_" + originalFileName;

        try {
            // Check if the file's name contains invalid characters
            if (fileName.contains("..")) {
                throw new RuntimeException("Sorry! Filename contains invalid path sequence " + fileName);
            }

            // Copy file to the target location (Replacing existing file with the same name)
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    public void deleteFile(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            System.out.println("Attempting to delete file: " + filePath);
            boolean deleted = Files.deleteIfExists(filePath);
            System.out.println("File deleted: " + deleted);
        } catch (IOException ex) {
            System.err.println("Could not delete file " + fileName + ": " + ex.getMessage());
        }
    }

    public void deleteThumbnail(String thumbnailPath) {
        if (thumbnailPath == null || thumbnailPath.isEmpty()) {
            return;
        }
        try {
            Path filePath = this.fileStorageLocation.resolve(thumbnailPath).normalize();
            System.out.println("Attempting to delete thumbnail: " + filePath);
            boolean deleted = Files.deleteIfExists(filePath);
            System.out.println("Thumbnail deleted: " + deleted);
        } catch (IOException ex) {
            System.err.println("Could not delete thumbnail " + thumbnailPath + ": " + ex.getMessage());
        }
    }
}
