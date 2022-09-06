package com.cardiff.maplife.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

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
                .defaultSuccessUrl("/",true).permitAll()
                .failureUrl("/authform?message=errorMessage")
                .and()
                .authorizeRequests()
                .antMatchers("/authform","/","/api/addUser","/api/getUser","/profile/{username}","/EventList","/CoHostSubmit").permitAll()
                .antMatchers("/js/**","/css/**","/image/*","/fonts/**","/**/*.png","/**/*.jpg").permitAll();

                http.csrf().disable();
        http.logout()
                .logoutSuccessUrl("/")
                .deleteCookies("JSESSIONID");
                super.configure(http);

    }



}


