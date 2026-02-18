package com.fish.discordbot.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "discord_id", nullable = false, unique = true)
    private String discordId;

    @Column(nullable = false)
    private String username;

    private String email;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "created_at")
    LocalDateTime createdAt = LocalDateTime.now();
}
