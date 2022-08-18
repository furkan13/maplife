package com.cardiff.maplife.security;

import com.cardiff.maplife.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import javax.annotation.Resource;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Configuration
@EnableWebSecurity
public class securityconfig extends WebSecurityConfigurerAdapter {
    @Bean
    PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http.formLogin()
                .loginPage("/authform")
                .loginProcessingUrl("/login")
                //.defaultSuccessUrl("/api/showUserName",true).permitAll()
//                .successForwardUrl("/api/showUserObject").permitAll()
                .failureUrl("/authform?message=errorMessage")
                .and()
                .authorizeRequests()
//                .antMatchers("/subscriptions").hasAnyAuthority("ROLE_USER")
                .antMatchers("/subscriptions").hasRole("USER")
                .antMatchers("/authform","/","/api/addUser").permitAll()
                .antMatchers("/explore/**").hasRole("USER")
                .antMatchers("/nearby/**").hasRole("USER")
                .antMatchers("/trending/**").hasRole("USER")
                .antMatchers("/js/**","/css/**","/images/*","/fonts/**","/**/*.png","/**/*.jpg").permitAll();
//                .anyRequest()
//                .authenticated();
                http.csrf().disable();
                super.configure(http);

    }



}


