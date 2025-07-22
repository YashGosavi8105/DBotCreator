package com.fish.discordbot.controller;

import org.springframework.core.annotation.Order;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@Order(2) // Lower priority than AuthController
public class FallbackController {

    /**
     * Fallback handler for unmatched routes
     * Redirects to the main index page if user is authenticated,
     * otherwise redirects to login page
     */
    @GetMapping("/app/**")
    public String fallback(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            return "redirect:/index";
        }
        return "redirect:/login";
    }
    
    /**
     * Handle 404 errors gracefully
     */
    @GetMapping("/404")
    public String notFound() {
        return "error/404";
    }
    
    /**
     * Handle application-specific errors
     */
    @GetMapping("/app-error")
    public String appError() {
        return "error/generic";
    }
}