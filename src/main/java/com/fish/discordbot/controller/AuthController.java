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
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.net.URI;
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
    public String index(@AuthenticationPrincipal OAuth2User principal, Model model) {
        if (principal != null) {
            addUserDataToModel(principal, model);
        }
        return "index";
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

        // Instead of redirecting to /index, redirect to port 8081
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

    @GetMapping("/profile")
    public String profile(@AuthenticationPrincipal OAuth2User principal, Model model) {
        if (principal == null) {
            return "redirect:/login";
        }

        addUserDataToModel(principal, model);
        return "profile";
    }

    @GetMapping("/prompt")
    public String prompt(@AuthenticationPrincipal OAuth2User principal, Model model) {
        if (principal == null) {
            return "redirect:/login";
        }

        addUserDataToModel(principal, model);
        return "prompt";
    }

    @GetMapping("/callback")
    public ResponseEntity<Void> authCallback(HttpServletRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create("http://localhost:8081"));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    private void addUserDataToModel(OAuth2User principal, Model model) {
        String discordId = principal.getAttribute("id");
        String username = principal.getAttribute("username");
        String email = principal.getAttribute("email");
        String avatar = principal.getAttribute("avatar");

        model.addAttribute("name", username);
        model.addAttribute("email", email);
        model.addAttribute("id", discordId);
        model.addAttribute("avatar", avatar);
    }
}
