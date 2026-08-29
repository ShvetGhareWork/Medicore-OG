package com.example.identity.entity;

import com.example.identity.entity.type.AuthProviderType;
import com.example.identity.entity.type.RoleType;
import com.example.identity.security.RolePermissionMapping;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "user_table")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;
    private String password;

    private String providerId;

    @Enumerated(EnumType.STRING)
    private AuthProviderType providerType;

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    private Set<RoleType> roles = new HashSet<>();

    public User() {
    }

    public User(Long id, String username, String password, String providerId, AuthProviderType providerType, Set<RoleType> roles) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.providerId = providerId;
        this.providerType = providerType;
        this.roles = roles != null ? roles : new HashSet<>();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String username;
        private String password;
        private String providerId;
        private AuthProviderType providerType;
        private Set<RoleType> roles = new HashSet<>();

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder username(String username) {
            this.username = username;
            return this;
        }

        public Builder password(String password) {
            this.password = password;
            return this;
        }

        public Builder providerId(String providerId) {
            this.providerId = providerId;
            return this;
        }

        public Builder providerType(AuthProviderType providerType) {
            this.providerType = providerType;
            return this;
        }

        public Builder roles(Set<RoleType> roles) {
            this.roles = roles;
            return this;
        }

        public User build() {
            return new User(id, username, password, providerId, providerType, roles);
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Override
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getProviderId() {
        return providerId;
    }

    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }

    public AuthProviderType getProviderType() {
        return providerType;
    }

    public void setProviderType(AuthProviderType providerType) {
        this.providerType = providerType;
    }

    public Set<RoleType> getRoles() {
        return roles;
    }

    public void setRoles(Set<RoleType> roles) {
        this.roles = roles;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<SimpleGrantedAuthority> authorities = new HashSet<>();
        if (roles != null) {
            roles.forEach(role -> {
                Set<SimpleGrantedAuthority> permissions = RolePermissionMapping.getAuthoritiesForRole(role);
                authorities.addAll(permissions);
                authorities.add(new SimpleGrantedAuthority("ROLE_" + role.name()));
            });
        }
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
