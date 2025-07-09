package com.fish.discordbot.controller;

import com.fish.discordbot.model.entity.User;
import com.fish.discordbot.service.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Optional;

@Controller
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/")
    public String home() {
        return "home";
    }

    @GetMapping("/index")
    public String index()
    {
        return "index";
    }
    
    @GetMapping("/welcome")
    public String welcome(@AuthenticationPrincipal OAuth2User principal, Model model) {
        // Add null check for principal
        if (principal == null) {
            return "redirect:/login";
        }

        try {
            // Get attributes with null checks
            String discordId = principal.getAttribute("id");
            String username = principal.getAttribute("username");
            String email = principal.getAttribute("email");
            String avatar = principal.getAttribute("avatar");

            // Validate required fields
            if (discordId == null || username == null) {
                throw new IllegalStateException("Required Discord user data is missing");
            }

            // Save to DB if not exists
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

            // Pass data to view - matching the HTML template attribute names
            model.addAttribute("name", username);  // HTML expects "name"
            model.addAttribute("email", email);
            model.addAttribute("id", discordId);   // HTML expects "id"
            model.addAttribute("avatar", avatar);  // HTML expects "avatar"

            return "welcome";
            
        } catch (Exception e) {
            // Log the error and redirect to login
            System.err.println("Error processing user data: " + e.getMessage());
            return "redirect:/login?error=true";
        }
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }
}