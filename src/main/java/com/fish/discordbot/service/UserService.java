package com.fish.discordbot.service;

import com.fish.discordbot.model.dto.UserDTO;
import com.fish.discordbot.model.entity.User;
import com.fish.discordbot.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public Optional<User> findByDiscordId(String discordId) {
        return userRepository.findByDiscordId(discordId);
    }

    public User findOrCreateUser(UserDTO userDTO) {
        Optional<User> existingUser = userRepository.findByDiscordId(userDTO.getDiscordId());

        if (existingUser.isPresent()) {
            return existingUser.get();
        } else {
            User newUser = User.builder()
                    .discordId(userDTO.getDiscordId())
                    .username(userDTO.getUsername())
                    .email(userDTO.getEmail())
                    .avatarUrl(userDTO.getAvatarUrl())
                    .build();
            return userRepository.save(newUser);
        }
    }

    public Optional<User> getUserByDiscordId(String discordId) {
        return userRepository.findByDiscordId(discordId);
    }
}
