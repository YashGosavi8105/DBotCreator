package com.fish.discordbot.model.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO 
{
    private String discordId;
    private String username;
    private String email;
    private String avatarUrl;
}
