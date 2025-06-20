package com.fish.discordbot.controller;

import com.fish.discordbot.model.dto.UserDTO;
import com.fish.discordbot.model.entity.User;
import com.fish.discordbot.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/test")
    public String createTestUser(@RequestBody UserDTO userDTO) {
        User user = User.builder()
                .discordId(userDTO.getDiscordId())
                .username(userDTO.getUsername())
                .email(userDTO.getEmail())
                .avatarUrl(userDTO.getAvatarUrl())
                .build();

        userService.save(user);
        return "Test user created";
    }
}
