package com.cardiff.maplife.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    // Configure Virtual Path Mapping Access
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // images save location                 //static location for test, will be replaced by Furkan's
//        registry.addResourceHandler("/image/**")
//                .addResourceLocations("file:C:\\Users\\c21086851\\OneDrive - Cardiff University\\dissertation\\project_44b_party_watch\\src\\main\\resources\\static\\image\\");
    }
}
