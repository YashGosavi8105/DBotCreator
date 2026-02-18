package com.fish.discordbot.repository;

import com.fish.discordbot.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByDiscordId(String discordId);
}
