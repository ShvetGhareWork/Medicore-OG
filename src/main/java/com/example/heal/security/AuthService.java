package com.example.heal.security;

import com.example.heal.dto.LoginRequestDto;
import com.example.heal.dto.LoginResponseDto;
import com.example.heal.dto.SignUpRequestDto;
import com.example.heal.dto.SignUpResponseDto;
import com.example.heal.entity.User;
import com.example.heal.entity.type.AuthProviderType;
import com.example.heal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.common.security.oauthbearer.internals.unsecured.OAuthBearerScopeUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthUtil authUtil;

    public LoginResponseDto login(LoginRequestDto loginRequestDto) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDto.getUsername(), loginRequestDto.getPassword())
        );

        User user = (User) authentication.getPrincipal();
        String token = authUtil.generateAccessToken(user);

        return new LoginResponseDto(token, user.getId());

    }

    public User signUpInternal(SignUpRequestDto signUpRequestDto, AuthProviderType authProviderType, String providerId) {
        User user = userRepository.findByUsername(signUpRequestDto.getUsername()).orElse(null);

        if(user != null) throw new IllegalArgumentException("User already exists");

        user = User.builder()
                .username(signUpRequestDto.getUsername())
                .providerId(providerId)
                .providerType(authProviderType)
                .roles(signUpRequestDto.getRoles())
                .build();

        if(authProviderType == AuthProviderType.EMAIL) {
            user.setPassword(passwordEncoder.encode(signUpRequestDto.getPassword()));
        }

        return userRepository.save(user);
    }

    public SignUpResponseDto signup(SignUpRequestDto signUpRequestDto) {
        User user = signUpInternal(signUpRequestDto, AuthProviderType.EMAIL, null);
        return new SignUpResponseDto(user.getId(), user.getUsername());
    }
}
