package com.videovault.demo.repository;

import com.videovault.demo.model.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VideoRepository extends JpaRepository<Video, String> {
    List<Video> findByUserId(String userId);
}
