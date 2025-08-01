package com.bookly.backend.dto;

import java.time.LocalDate;

public class SignupRequest {
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String password;
    private LocalDate birthday;
    private String profilePictureUrl;

    // Constructors
    public SignupRequest() {}

    public SignupRequest(String firstName, String lastName, String username, String email, String password, LocalDate birthday, String profilePictureUrl) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.email = email;
        this.password = password;
        this.birthday = birthday;
        this.profilePictureUrl = profilePictureUrl;
    }

    // Getters and Setters
    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public LocalDate getBirthday() {
        return birthday;
    }

    public void setBirthday(LocalDate birthday) {
        this.birthday = birthday;
    }

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }

    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }
}