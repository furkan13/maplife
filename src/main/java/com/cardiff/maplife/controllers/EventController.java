package com.cardiff.maplife.controllers;


import com.cardiff.maplife.entities.Event;
import com.cardiff.maplife.fileUpload.EventFileUploadUtil;
import com.cardiff.maplife.services.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Controller
public class EventController {

    @Autowired
    EventService eventService;






    @RequestMapping("/addevents")
    public String addEvents(@ModelAttribute("events")Event event, @RequestParam(value = "image",required = false)MultipartFile file) throws IOException,NullPointerException {


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
            eventService.save(event);


            System.out.println("done");



            String uploadDir = "event/" + event.getId();

            EventFileUploadUtil.saveFile(uploadDir, fileName, file); //sending upload dir,filename and the file to the upload utility
        }

        return "events/addevents";
    }


}
