package com.cardiff.maplife.controllers;


import com.cardiff.maplife.entities.Event;
import com.cardiff.maplife.entities.User;
import com.cardiff.maplife.fileUpload.EventFileUploadUtil;
import com.cardiff.maplife.services.EventService;
import com.cardiff.maplife.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Controller
public class AddEventController {


    @Autowired
    EventService eventService;
    @Autowired
    UserService userService;






    @RequestMapping("/addevents")
    public String addEvents(@ModelAttribute("events") Event event, @RequestParam(value = "image",required = false) MultipartFile file,@AuthenticationPrincipal User user) throws IOException,NullPointerException {


        System.out.println(event.getTitle());
        System.out.println(event.getEvent_dis());

        String fileName = "";
        try {
            fileName = StringUtils.cleanPath(file.getOriginalFilename()); //get the acrual file name
            event.setEventImageName(fileName);
            System.out.println(fileName);


        } catch (Exception e) {

        }

        if (event.getTitle() != null) {


            System.out.println(event.getTitle());
            event.setHost_id(user.getId());
            eventService.save(event);


            System.out.println("done");



            String uploadDir = "event/" + event.getId();

            EventFileUploadUtil.saveFile(uploadDir, fileName, file); //sending upload dir,filename and the file to the upload utility
        }

        return "events/addevents";
    }


}
