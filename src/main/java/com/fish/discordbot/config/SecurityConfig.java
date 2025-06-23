package com.fish.discordbot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import static org.springframework.security.config.Customizer.withDefaults;


@Configuration
public class SecurityConfig 
{
        @Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
            http.authorizeHttpRequests(auth -> auth.requestMatchers("/", "/login", "/error").permitAll().anyRequest().authenticated()).oauth2Login(withDefaults()); // Use default config unless you override it

    return http.build();
}

}
