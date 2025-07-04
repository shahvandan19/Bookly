package com.bookly.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.bookly.backend.dto.LoginRequest;
import com.bookly.backend.dto.SignupRequest;
import com.bookly.backend.dto.JwtResponse;
import com.bookly.backend.dto.ErrorResponse;
import com.bookly.backend.security.JwtUtil;
import com.bookly.backend.model.User;
import com.bookly.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        System.out.println("Login attempt for email: " + loginRequest.getEmail());

        // Input validation
        if (loginRequest.getEmail() == null || loginRequest.getEmail().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("Email is required"));
        }
        if (loginRequest.getPassword() == null || loginRequest.getPassword().length() < 6) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("Password must be at least 6 characters"));
        }
        if (!loginRequest.getEmail().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("Invalid email format"));
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),  // Using email as username
                    loginRequest.getPassword()
                )
            );

            // Generate JWT token
            String jwt = jwtUtil.generateToken(loginRequest.getEmail());
            
            System.out.println("Login successful for: " + loginRequest.getEmail());
            return ResponseEntity.ok(new JwtResponse(jwt));
            
        } catch (AuthenticationException e) {
            System.out.println("Login failed for: " + loginRequest.getEmail() + " - " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse("Invalid email or password"));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest signupRequest) {
        System.out.println("Signup attempt for email: " + signupRequest.getEmail());
        
        // Input validation
        if (signupRequest.getFirstName() == null || signupRequest.getFirstName().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("First name is required"));
        }
        if (signupRequest.getLastName() == null || signupRequest.getLastName().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("Last name is required"));
        }
        if (signupRequest.getEmail() == null || signupRequest.getEmail().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("Email is required"));
        }
        if (!signupRequest.getEmail().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("Invalid email format"));
        }
        if (signupRequest.getPassword() == null || signupRequest.getPassword().length() < 6) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("Password must be at least 6 characters"));
        }
        if (signupRequest.getUsername() == null || signupRequest.getUsername().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("Username is required"));
        }
        // Optionally, add more checks (birthday, profilePictureUrl, etc.)

        try {
            // Check if user already exists (email)
            if (userRepository.findByEmail(signupRequest.getEmail()).isPresent()) {
                System.out.println("User already exists: " + signupRequest.getEmail());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("User with this email already exists"));
            }
            // Check if username already exists
            if (userRepository.findByUsername(signupRequest.getUsername()).isPresent()) {
                System.out.println("Username already taken: " + signupRequest.getUsername());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Username is already taken"));
            }
            
            // Create new user
            User user = new User(
                signupRequest.getFirstName(),
                signupRequest.getLastName(),
                signupRequest.getUsername(),
                signupRequest.getEmail(),
                passwordEncoder.encode(signupRequest.getPassword()),
                signupRequest.getBirthday(),
                signupRequest.getProfilePictureUrl()
            );
            
            // Generate username from email (optional, or use a different logic)
            String username = signupRequest.getEmail().split("@")[0];
            user.setUsername(username);
            
            System.out.println("About to save user with email: " + user.getEmail());
            User savedUser = userRepository.save(user);
            System.out.println("User saved successfully with ID: " + savedUser.getId());
            
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ErrorResponse("User created successfully"));
            
        } catch (Exception e) {
            System.out.println("Signup failed for: " + signupRequest.getEmail() + " - " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Failed to create user: " + e.getMessage()));
        }
    }

    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        System.out.println("Ping endpoint hit");
        return ResponseEntity.ok("Pong! Server is running");
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        System.out.println("Test endpoint hit");
        return ResponseEntity.ok("Test successful!");
    }
    
    @GetMapping("/profile")
    public ResponseEntity<String> profile() {
        System.out.println("Profile endpoint hit");
        return ResponseEntity.ok("Profile data - JWT authentication working!");
    }

    // Danger: Dev-only endpoint to delete all users!
    @DeleteMapping("/deleteAllUsers")
    public ResponseEntity<String> deleteAllUsers() {
        userRepository.deleteAll();
        System.out.println("All users deleted!");
        return ResponseEntity.ok("All users deleted!");
    }
}