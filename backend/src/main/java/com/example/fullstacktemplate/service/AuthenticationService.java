package com.example.fullstacktemplate.service;

import com.example.fullstacktemplate.config.AppProperties;
import com.example.fullstacktemplate.config.security.UserPrincipal;
import com.example.fullstacktemplate.dto.AuthResponseDto;
import com.example.fullstacktemplate.dto.LoginRequestDto;
import com.example.fullstacktemplate.dto.LoginVerificationRequestDto;
import com.example.fullstacktemplate.dto.mapper.UserMapper; // ADAUGĂ ACEASTĂ LINIE
import com.example.fullstacktemplate.exception.BadRequestException;
import com.example.fullstacktemplate.model.JwtToken;
import com.example.fullstacktemplate.model.TokenType;
import com.example.fullstacktemplate.model.User;
import com.example.fullstacktemplate.repository.TokenRepository;
import com.example.fullstacktemplate.repository.TwoFactoryRecoveryCodeRepository;
import com.example.fullstacktemplate.repository.UserRepository;
import dev.samstevens.totp.code.CodeGenerator;
import dev.samstevens.totp.code.CodeVerifier;
import dev.samstevens.totp.code.DefaultCodeGenerator;
import dev.samstevens.totp.code.DefaultCodeVerifier;
import dev.samstevens.totp.time.SystemTimeProvider;
import dev.samstevens.totp.time.TimeProvider;
import lombok.extern.slf4j.Slf4j; // ADAUGĂ ACEASTĂ LINIE
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.Date;
import java.util.Optional;
import java.util.TimeZone;

@Service
@Transactional
@Slf4j // ADAUGĂ ACEASTĂ LINIE
public class AuthenticationService {

    public static final String REFRESH_TOKEN_COOKIE_NAME = "rt_cookie";
    private final UserRepository userRepository;
    private final TwoFactoryRecoveryCodeRepository twoFactoryRecoveryCodeRepository;
    private final TokenService tokenService;
    private final AppProperties appProperties;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final TokenRepository tokenRepository;
    private final MessageService messageService;
    private final UserMapper userMapper; // ADAUGĂ ACEASTĂ LINIE

    public AuthenticationService(UserRepository userRepository, TwoFactoryRecoveryCodeRepository twoFactoryRecoveryCodeRepository, TokenService tokenService, AppProperties appProperties, AuthenticationManager authenticationManager, UserService userService, TokenRepository tokenRepository, MessageService messageService, UserMapper userMapper) { // ADAUGĂ userMapper ÎN CONSTRUCTOR
        this.userRepository = userRepository;
        this.twoFactoryRecoveryCodeRepository = twoFactoryRecoveryCodeRepository;
        this.tokenService = tokenService;
        this.appProperties = appProperties;
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.tokenRepository = tokenRepository;
        this.messageService = messageService;
        this.userMapper = userMapper; // ADAUGĂ ACEASTĂ LINIE
    }

    // Toate metodele rămân la fel până la getAuthResponse...

    private boolean isVerificationCodeValid(Long userId, String verificationCode) {
        User user = userRepository.findById(userId).orElseThrow(() -> new BadRequestException("userNotFound"));
        return isVerificationCodeValid(user, verificationCode);
    }

    private boolean isVerificationCodeValid(User user, String verificationCode) {
        TimeProvider timeProvider = new SystemTimeProvider();
        CodeGenerator codeGenerator = new DefaultCodeGenerator();
        CodeVerifier verifier = new DefaultCodeVerifier(codeGenerator, timeProvider);
        return verifier.isValidCode(user.getTwoFactorSecret(), verificationCode);
    }

    private boolean isRecoveryCodeValid(Long userId, String recoveryCode) {
        User user = userRepository.findById(userId).orElseThrow(() -> new BadRequestException("userNotFound"));
        return isRecoveryCodeValid(user, recoveryCode);
    }

    private boolean isRecoveryCodeValid(User user, String recoveryCode) {
        return user.getTwoFactorRecoveryCodes()
                .stream()
                .anyMatch(twoFactorRecoveryCode -> recoveryCode.equals(twoFactorRecoveryCode.getRecoveryCode()));
    }

    private void deleteRecoveryCode(Long userId, String recoveryCode) {
        twoFactoryRecoveryCodeRepository.deleteByUserIdAndRecoveryCode(userId, recoveryCode);
    }

    public AuthResponseDto loginWithVerificationCode(UserPrincipal userPrincipal, String code) {
        User user = userService.findById(userPrincipal.getId()).orElseThrow(() -> new BadRequestException("userNotFound"));
        if (isVerificationCodeValid(userPrincipal.getId(), code)) {
            return getAuthResponse(user);
        }
        throw new BadRequestException("invalidVerificationCode");
    }

    public AuthResponseDto loginWithVerificationCode(LoginVerificationRequestDto loginVerificationRequestDto) {
        UserPrincipal userPrincipal = getUserPrincipal(loginVerificationRequestDto.getEmail(), loginVerificationRequestDto.getPassword());
        return loginWithVerificationCode(userPrincipal, loginVerificationRequestDto.getCode());
    }

    public AuthResponseDto loginWithRecoveryCode(UserPrincipal userPrincipal, String verificationCode) {
        User user = userService.findByEmail(userPrincipal.getEmail()).orElseThrow(() -> new BadRequestException("userNotFound"));
        if (isRecoveryCodeValid(user.getId(), verificationCode)) {
            deleteRecoveryCode(user.getId(), verificationCode);
            return getAuthResponse(user);
        }
        throw new BadRequestException("invalidRecoveryCode");
    }

    public AuthResponseDto loginWithRecoveryCode(LoginVerificationRequestDto loginVerificationRequestDto) {
        UserPrincipal userPrincipal = getUserPrincipal(loginVerificationRequestDto.getEmail(), loginVerificationRequestDto.getPassword());
        return loginWithRecoveryCode(userPrincipal, loginVerificationRequestDto.getCode());
    }

    public AuthResponseDto login(UserPrincipal userPrincipal) {
        User user = userService.findByEmail(userPrincipal.getEmail()).orElseThrow(() -> new BadRequestException("userNotFound"));
        if (user.getEmailVerified()) {
            return getAuthResponse(user);
        }
        throw new BadRequestException("accountNotActivated");
    }

    public AuthResponseDto login(LoginRequestDto loginRequestDto) {
        log.info("🔐 Login attempt for email: {}", loginRequestDto.getEmail()); // ADAUGĂ DEBUGGING
        UserPrincipal userPrincipal = getUserPrincipal(loginRequestDto.getEmail(), loginRequestDto.getPassword());
        AuthResponseDto response = login(userPrincipal);
        log.info("✅ Login successful for: {}", loginRequestDto.getEmail()); // ADAUGĂ DEBUGGING
        return response;
    }

    public Optional<JwtToken> getRefreshToken() {
        HttpServletRequest request = Optional.ofNullable((ServletRequestAttributes) RequestContextHolder.getRequestAttributes())
                .map(ServletRequestAttributes::getRequest).orElseThrow(IllegalStateException::new);
        if (request.getCookies() != null) {
            return Arrays.stream(request.getCookies())
                    .filter(cookie -> REFRESH_TOKEN_COOKIE_NAME.equals(cookie.getName()))
                    .findFirst()
                    .flatMap(cookie -> tokenRepository.findByValueAndTokenType(cookie.getValue(), TokenType.REFRESH));
        }
        return Optional.empty();
    }

    public String createAccessToken(User user) {
        return tokenService.createJwtTokenValue(user.getId(), Duration.of(appProperties.getAuth().getAccessTokenExpirationMsec(), ChronoUnit.MILLIS));
    }

    private JwtToken createRefreshToken(User user) {
        return tokenService.createToken(user, Duration.of(appProperties.getAuth().getRefreshTokenExpirationMsec(), ChronoUnit.MILLIS), TokenType.REFRESH);
    }

    private void addRefreshToken(User user) {
        JwtToken refreshToken = createRefreshToken(user);
        HttpServletResponse response = Optional.ofNullable((ServletRequestAttributes) RequestContextHolder.getRequestAttributes())
                .map(ServletRequestAttributes::getResponse).orElseThrow(IllegalStateException::new);
        Date expires = new Date();
        expires.setTime(expires.getTime() + appProperties.getAuth().getRefreshTokenExpirationMsec());
        DateFormat df = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss zzz", java.util.Locale.US);
        df.setTimeZone(TimeZone.getTimeZone("GMT"));
        response.setHeader("Set-Cookie", String.format("%s=%s; Expires=%s; Path=/; HttpOnly; SameSite=none; Secure", REFRESH_TOKEN_COOKIE_NAME, refreshToken.getValue(), df.format(expires)));
    }

    public void removeRefreshToken() {
        HttpServletResponse response = Optional.ofNullable((ServletRequestAttributes) RequestContextHolder.getRequestAttributes())
                .map(ServletRequestAttributes::getResponse).orElseThrow(IllegalStateException::new);
        Date expires = new Date();
        expires.setTime(expires.getTime() + 1);
        DateFormat df = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss zzz", java.util.Locale.US);
        df.setTimeZone(TimeZone.getTimeZone("GMT"));
        response.setHeader("Set-Cookie", String.format("%s=; Expires=%s; Path=/; HttpOnly; SameSite=none; Secure", REFRESH_TOKEN_COOKIE_NAME, df.format(expires)));
    }

    public void logout(User user) {
        Optional<JwtToken> optionalRefreshToken = getRefreshToken();
        if (optionalRefreshToken.isPresent() && optionalRefreshToken.get().getUser().getId().equals(user.getId())) {
            tokenService.delete(optionalRefreshToken.get());
            removeRefreshToken();
        } else {
            throw new BadRequestException("tokenExpired");
        }
    }

    private UserPrincipal getUserPrincipal(String email, String password) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        return (UserPrincipal) authentication.getPrincipal();
    }

    // ACEASTA ESTE METODA CHEIE CARE TREBUIE MODIFICATĂ
    private AuthResponseDto getAuthResponse(User user) {
        log.info("🔍 Creating auth response for user - ID: {}, Email: {}, Role: {}", 
            user.getId(), user.getEmail(), user.getRole());
        
        String accessToken = createAccessToken(user);
        AuthResponseDto authResponseDto = new AuthResponseDto();
        authResponseDto.setTwoFactorRequired(user.getTwoFactorEnabled());
        authResponseDto.setAccessToken(accessToken);
        authResponseDto.setTokenType("Bearer");
        
        // ADĂUGAT - INCLUDE UTILIZATORUL ÎN RĂSPUNS
        authResponseDto.setUser(userMapper.toDto(user));
        
        // DEBUGGING SUPLIMENTAR
        if (authResponseDto.getUser() != null) {
            log.info("👤 UserDto created - ID: {}, Email: {}, Role: {}", 
                authResponseDto.getUser().getId(), 
                authResponseDto.getUser().getEmail(), 
                authResponseDto.getUser().getRole());
        } else {
            log.error("❌ UserDto is NULL! UserMapper might not be working!");
        }
        
        addRefreshToken(user);
        
        log.info("✅ AuthResponseDto complete with user data");
        return authResponseDto;
    }
}