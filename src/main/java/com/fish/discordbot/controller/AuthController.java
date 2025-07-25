package com.fish.discordbot.controller;

import com.fish.discordbot.model.entity.User;
import com.fish.discordbot.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Controller
@CrossOrigin(origins = "http://localhost:8081", allowCredentials = "true")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/")
    public String home() {
        return "home";
    }

    @GetMapping("/welcome")
    public String welcome(@AuthenticationPrincipal OAuth2User principal, RedirectAttributes redirectAttributes) {
        if (principal == null) {
            return "redirect:/login";
        }

        try {
            String discordId = principal.getAttribute("id");
            String username = principal.getAttribute("username");
            String email = principal.getAttribute("email");
            String avatar = principal.getAttribute("avatar");

            if (discordId == null || username == null) {
                throw new IllegalStateException("Required Discord user data is missing");
            }

            Optional<User> existingUser = userService.findByDiscordId(discordId);
            if (existingUser.isEmpty()) {
                String avatarUrl = null;
                if (avatar != null) {
                    avatarUrl = "https://cdn.discordapp.com/avatars/" + discordId + "/" + avatar + ".png";
                }

                User user = User.builder()
                        .discordId(discordId)
                        .username(username)
                        .email(email)
                        .avatarUrl(avatarUrl)
                        .build();
                userService.save(user);
            }

            // Redirect to the frontend app (port 8081)
            return "redirect:http://localhost:8081";

        } catch (Exception e) {
            System.err.println("Error processing user data: " + e.getMessage());
            return "redirect:/login?error=true";
        }
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/callback")
    public ResponseEntity<Void> authCallback(HttpServletRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create("http://localhost:8081"));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    @GetMapping("/api/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.ok(Map.of("authenticated", false));
        }

        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("authenticated", true);
        userInfo.put("username", principal.getAttribute("username"));
        userInfo.put("email", principal.getAttribute("email"));
        userInfo.put("avatar", principal.getAttribute("avatar"));
        userInfo.put("id", principal.getAttribute("id"));

        return ResponseEntity.ok(userInfo);
    }
}