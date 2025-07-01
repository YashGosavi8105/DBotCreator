package com.fish.discordbot.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AuthController {

    @GetMapping("/")
    public String home() {
        return "home";
    }

    @GetMapping("/welcome")
    public String welcome(@AuthenticationPrincipal OAuth2User principal, Model model) {
        String username = principal.getAttribute("username");
        String id = principal.getAttribute("id");
        String avatar = principal.getAttribute("avatar");

        System.out.println("Fetched Discord User Info:");
        System.out.println("Username: " + username);
        System.out.println("ID: " + id);
        System.out.println("Avatar Hash: " + avatar);

        model.addAttribute("name", username);
        model.addAttribute("id", id);
        model.addAttribute("avatar", avatar);
        return "welcome";
    }
    


    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/home")
    public String redirectHome() {
        return "redirect:/";
    }

}
