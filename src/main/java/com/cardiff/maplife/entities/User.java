package com.cardiff.maplife.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "user")

public class User implements UserDetails, Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_Id")
    private Long user_id;

    @Column(name = "username")
    private String username;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(name = "password")
    private String password;

    @Column(name = "email")
    private String email;

    @Column(name = "userType")
    private boolean userType;

    @Column(name = "coins")
    private int coins;

    @Column(name = "views")
    private int views;

    @Column(name = "icon")
    private String icon;

    @Column(name = "roles")
    private String roles;

    @Column(name = "video")
    private String video;

    @Column(name = "bio")
    private String bio;

    private LocalDate lastLogin;
    private int coin;


    @OneToMany(mappedBy = "user")  //Creating one to many relation with booking class and Using user object from Booking class
    List<Event> eventList=new ArrayList<>();

    //create a join table to implement the ManyToMany relation between user and following_user.
    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonIgnoreProperties(value = {"followingUserSet","followerUserSet"})
    @JoinTable(
            name = "user_follower",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "follower_id"))
    private Set<User> followerUserSet = new HashSet<>();

    @JsonIgnoreProperties(value = {"followingUserSet","followerUserSet"})
    @ManyToMany(mappedBy = "followerUserSet")
    private Set<User> followingUserSet = new HashSet<>();


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


    public User() {

    }

    public User(Long user_id, String username, String password, String email, boolean userType, int coins, int views, String icon, String roles, String video, String bio, List<Event> eventList, Set<User> followerUserSet, Set<User> followingUserSet, List<GrantedAuthority> authorities) {
        this.user_id = user_id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.userType = userType;
        this.coins = coins;
        this.views = views;
        this.icon = icon;
        this.roles = roles;
        this.video = video;
        this.bio = bio;
        this.eventList = eventList;
        this.followerUserSet = followerUserSet;
        this.followingUserSet = followingUserSet;
        this.authorities = authorities;
    }

    @Transient
    private List<GrantedAuthority> authorities;
    public void setAuthorities(List<GrantedAuthority> authorities) {
        this.authorities = authorities;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }
    public Long getId() {
        return user_id;
    }

    public void setId(Long user_id) {
        this.user_id = user_id;
    }

    public Long getUser_id() {
        return user_id;
    }

    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @JsonIgnore
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isUserType() {
        return userType;
    }

    public void setUserType(boolean userType) {
        this.userType = userType;
    }

    public int getCoins() {
        return coins;
    }

    public void setCoins(int coins) {
        this.coins = coins;
    }

    public int getViews() {
        return views;
    }

    public void setViews(int views) {
        this.views = views;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getRoles() {
        return roles;
    }

    public void setRoles(String roles) {
        this.roles = roles;
    }

    public String getVideo() {
        return video;
    }

    public void setVideo(String video) {
        this.video = video;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }


    public Set<User> getFollowerUserSet() {
        return followerUserSet;
    }

    public void setFollowerUserSet(Set<User> followerUserSet) {
        this.followerUserSet = followerUserSet;
    }

    public Set<User> getFollowingUserSet() {
        return followingUserSet;
    }

    public void setFollowingUserSet(Set<User> followingUserSet) {
        this.followingUserSet = followingUserSet;
    }

    public LocalDate getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(LocalDate lastLogin) {
        this.lastLogin = lastLogin;
    }

    public int getCoin() {
        return coin;
    }

    public void setCoin(int coin) {
        this.coin = coin;
    }

    public String getPhotosImagePath() {


        return "/image/"+ getIcon();
    }
}
