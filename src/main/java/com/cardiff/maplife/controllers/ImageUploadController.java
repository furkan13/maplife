package com.cardiff.maplife.controllers;

import com.cardiff.maplife.entities.User;
import com.cardiff.maplife.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@RestController
public class ImageUploadController {
    private final UserService userService;

    public ImageUploadController(UserService userService){
        this.userService=userService;
    }

    @PostMapping("api/uploadImage")
    public ResponseEntity<String> uploadImage(@RequestParam MultipartFile image ) throws IOException {
        User user=new User();
        //Check if the uploaded image is empty
        if (image.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot upload empty image");
        }

        //Check if the image is of right type
        Object imageObject = image.getContentType();
//        System.out.println(imageObject);
//        if (imageObject != null && !imageObject.toString().equals("image/jpeg") || imageObject != null && !imageObject.toString().equals("image/jpg")) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Only JPEG/JPG uploads allowed");
//        }

        //check if the image size is within specified range
        long imageSize = image.getSize();
        //greater than 5MB, 1 MB has 1000000 BYTES
        if (imageSize > 5000000) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Can upload images less than 5MB only");
        }

        //Method body to execute if everything is okay and good to upload
        String uploadDir = "src/main/resources/static/image";
        try {
            Files.copy(image.getInputStream(), Paths.get(uploadDir + File.separator + image.getOriginalFilename()), StandardCopyOption.REPLACE_EXISTING);
            String usernameFromUser = userService.getAuthentication();
            User loggedUser = (User) userService.loadUserByUsername(usernameFromUser);
            loggedUser.setIcon(image.getOriginalFilename());
            userService.saveUser(loggedUser);
            return ResponseEntity.status(HttpStatus.OK).body(image.getOriginalFilename());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage() + "\n File Could be Uploaded. Please tray again later.");
        }


    }

//    @PutMapping("api/updateImage")
//    public ResponseEntity<User> updateImage(@RequestParam MultipartFile image,@RequestBody User user){
//        String usernameFromUser = user.getUsername();
//        user.setIcon(image.getOriginalFilename());
////        User loggingUser = (User) userService.loadUserByUsername(usernameFromUser);
//        User savedUser=userService.saveUser(user);
//        return new ResponseEntity<>(savedUser, HttpStatus.OK);
//    }
}
