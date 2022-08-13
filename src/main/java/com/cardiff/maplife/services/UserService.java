package com.cardiff.maplife.services;

import com.cardiff.maplife.entities.User;
import com.cardiff.maplife.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
public class UserService implements UserDetailsService {

    public UserRepository userRepository;
    public UserService(UserRepository userRepository){
        this.userRepository=userRepository;
    }
    private PasswordEncoder passwordEncoder;
//    public User saveUser(User user){
//        return userRepository.save(user);
//    }
//    public Set<User> findAllUser(){
//        return userRepository.findAllUser();
//    }




    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user=userRepository.findUserByUsername(username);
        if(user==null){
            return null;
        }
        return user;

    }
//    public UserDetails saveUser(User user){
//        user.setPassword(passwordEncoder.encode(user.getPassword()));
//        return userRepository.save(user);
//    }
        public User saveUser(User user) {
//                user.setPassword(passwordEncoder.encode(user.getPassword()));

            return userRepository.save(user);
        }
}
