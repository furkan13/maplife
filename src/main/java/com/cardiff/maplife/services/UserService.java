package com.cardiff.maplife.services;

import com.cardiff.maplife.entities.User;
import com.cardiff.maplife.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
public class UserService implements UserDetailsService {
    @Autowired
    public UserRepository userRepository;
    public UserService(UserRepository userRepository){
        this.userRepository=userRepository;
    }

    public User saveUser(User user){
        return userRepository.save(user);
    }
//    public Set<User> findAllUser(){
//        return userRepository.findAllUser();
//    }

//    public  User findUserByUsername(String username){
//        Optional<User> optionalUser=userRepository.findUserByUsername(username);
//        if(optionalUser.isPresent()){
//            return optionalUser.get();
//        }
//        else {
//            return null;
//        }
//    }
    public  User findUserByUsername(String username){
        Optional<User> optionalUser=userRepository.findUserByUsername(username);
        if(optionalUser.isPresent()){
            return optionalUser.get();
        }
        else {
            return null;
        }
    }
    public User findUserByPassword(String password){
    Optional<User> optionalPassword =userRepository.findUserByPassword(password);
        if(optionalPassword.isPresent()){
        return optionalPassword.get();
    }
        else {
        return null;
    }
}


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user=userRepository.findUserByUsername(username);
        if(user.isPresent()){
            return (UserDetails) user.get();
        }
        else {
            return null;
        }
    }
}
