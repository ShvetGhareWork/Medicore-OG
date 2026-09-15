package com.example.identity.entity;

import com.example.identity.entity.type.*;
import com.example.identity.security.RolePermissionMapping;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalDateTime;
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

    private String fullName;

    private String email;

    @Column(unique = true)
    private String staffId;

    private String department;

    private String designation;

    private LocalDate dateOfBirth;

    private String contactNumber;

    private String photoUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporting_to_id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private User reportingTo;

    @Enumerated(EnumType.STRING)
    private AccessLevelType accessLevel;

    @Enumerated(EnumType.STRING)
    private LoginMethodType loginMethod;

    @Column(unique = true)
    private String badgeToken;

    private int badgeVersion = 1;

    @Enumerated(EnumType.STRING)
    private StaffStatusType status;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

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
        private String fullName;
        private String email;
        private String staffId;
        private String department;
        private String designation;
        private LocalDate dateOfBirth;
        private String contactNumber;
        private String photoUrl;
        private User reportingTo;
        private AccessLevelType accessLevel;
        private LoginMethodType loginMethod;
        private String badgeToken;
        private int badgeVersion = 1;
        private StaffStatusType status;

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

        public Builder fullName(String fullName) {
            this.fullName = fullName;
            return this;
        }

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder staffId(String staffId) {
            this.staffId = staffId;
            return this;
        }

        public Builder department(String department) {
            this.department = department;
            return this;
        }

        public Builder designation(String designation) {
            this.designation = designation;
            return this;
        }

        public Builder dateOfBirth(LocalDate dateOfBirth) {
            this.dateOfBirth = dateOfBirth;
            return this;
        }

        public Builder contactNumber(String contactNumber) {
            this.contactNumber = contactNumber;
            return this;
        }

        public Builder photoUrl(String photoUrl) {
            this.photoUrl = photoUrl;
            return this;
        }

        public Builder reportingTo(User reportingTo) {
            this.reportingTo = reportingTo;
            return this;
        }

        public Builder accessLevel(AccessLevelType accessLevel) {
            this.accessLevel = accessLevel;
            return this;
        }

        public Builder loginMethod(LoginMethodType loginMethod) {
            this.loginMethod = loginMethod;
            return this;
        }

        public Builder badgeToken(String badgeToken) {
            this.badgeToken = badgeToken;
            return this;
        }

        public Builder badgeVersion(int badgeVersion) {
            this.badgeVersion = badgeVersion;
            return this;
        }

        public Builder status(StaffStatusType status) {
            this.status = status;
            return this;
        }

        public User build() {
            User user = new User(id, username, password, providerId, providerType, roles);
            user.setFullName(fullName);
            user.setEmail(email);
            user.setStaffId(staffId);
            user.setDepartment(department);
            user.setDesignation(designation);
            user.setDateOfBirth(dateOfBirth);
            user.setContactNumber(contactNumber);
            user.setPhotoUrl(photoUrl);
            user.setReportingTo(reportingTo);
            user.setAccessLevel(accessLevel);
            user.setLoginMethod(loginMethod);
            user.setBadgeToken(badgeToken);
            user.setBadgeVersion(badgeVersion);
            user.setStatus(status);
            return user;
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

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getStaffId() {
        return staffId;
    }

    public void setStaffId(String staffId) {
        this.staffId = staffId;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public User getReportingTo() {
        return reportingTo;
    }

    public void setReportingTo(User reportingTo) {
        this.reportingTo = reportingTo;
    }

    public AccessLevelType getAccessLevel() {
        return accessLevel;
    }

    public void setAccessLevel(AccessLevelType accessLevel) {
        this.accessLevel = accessLevel;
    }

    public LoginMethodType getLoginMethod() {
        return loginMethod;
    }

    public void setLoginMethod(LoginMethodType loginMethod) {
        this.loginMethod = loginMethod;
    }

    public String getBadgeToken() {
        return badgeToken;
    }

    public void setBadgeToken(String badgeToken) {
        this.badgeToken = badgeToken;
    }

    public int getBadgeVersion() {
        return badgeVersion;
    }

    public void setBadgeVersion(int badgeVersion) {
        this.badgeVersion = badgeVersion;
    }

    public StaffStatusType getStatus() {
        return status;
    }

    public void setStatus(StaffStatusType status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<SimpleGrantedAuthority> authorities = new HashSet<>();
        if (roles != null) {
            roles.forEach(role -> {
                Set<SimpleGrantedAuthority> permissions = RolePermissionMapping.getAuthoritiesForRole(role);
                if (permissions != null) {
                    authorities.addAll(permissions);
                }
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
        return status == null || status == StaffStatusType.ACTIVE;
    }
}
