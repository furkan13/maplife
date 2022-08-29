package com.cardiff.maplife.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        exposeDirectory("image", registry);
    }
    private void exposeDirectory(String dirName, ResourceHandlerRegistry registry) {
        Path uploadDir2 = Paths.get(dirName);
        String uploadPath = uploadDir2.toFile().getAbsolutePath();
        String realUploadPath="\\src\\main\\resources\\static\\image";
        uploadPath = uploadPath.replace("image", realUploadPath);
        System.out.println(uploadPath);
        registry.addResourceHandler("/image/**").addResourceLocations("file:/"+ uploadPath + "/");
    }
}
