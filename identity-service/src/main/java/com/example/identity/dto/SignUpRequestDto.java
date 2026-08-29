package com.example.identity.dto;

import com.example.identity.entity.type.RoleType;

import java.util.HashSet;
import java.util.Set;

public class SignUpRequestDto {
    private String username;
    private String password;
    private String name;
    private Set<RoleType> roles = new HashSet<>();

    public SignUpRequestDto() {
    }

    public SignUpRequestDto(String username, String password, String name, Set<RoleType> roles) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.roles = roles != null ? roles : new HashSet<>();
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<RoleType> getRoles() {
        return roles;
    }

    public void setRoles(Set<RoleType> roles) {
        this.roles = roles;
    }
}
