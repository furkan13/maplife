package com.cardiff.maplife.services;

import com.cardiff.maplife.entities.User;
import com.cardiff.maplife.repositories.UserRepository;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
public class UserService implements UserDetailsService {

    public UserRepository userRepository;
    public UserService(UserRepository userRepository){
        this.userRepository=userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user=userRepository.findUserByUsername(username);
        if(user==null){
            return null;
        }
        user.setAuthorities(AuthorityUtils.commaSeparatedStringToAuthorityList(user.getRoles()));
        return user;

    }

    public User findUserByUsername(String username){
        return userRepository.findUserByUsername(username);
    }

    public User saveUser(User user) {
            return userRepository.save(user);
    }
    public User findUserByUserId(long id){
        return userRepository.findById(id);
    }
    public String getAuthentication(){
         Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
         if (!(authentication instanceof AnonymousAuthenticationToken)) {
             return authentication.getName();
         }
         return null;
    }

    public void deleteById(Long id){
        userRepository.deleteById(id);
    }
    public List<User> searchResult(String key){
        return userRepository.searchResults(key);
    }









}
