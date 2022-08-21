package com.cardiff.maplife.controllers;


import com.cardiff.maplife.entities.Event;
import com.cardiff.maplife.entities.User;
import com.cardiff.maplife.fileUpload.EventFileUploadUtil;
import com.cardiff.maplife.services.EventService;
import com.cardiff.maplife.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.net.BindException;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Controller
public class AddEventController {


    @Autowired
    EventService eventService;
    @Autowired
    UserService userService;







    @RequestMapping ("/addevents")
    public String addEvents( @ModelAttribute("events") Event event,Model model, @RequestParam(value = "image",required = false) MultipartFile file, @AuthenticationPrincipal User user, HttpSession session, RedirectAttributes redirAttrs) throws IOException,NullPointerException, BindException {
        //session.getAttribute()

        System.out.println(event.getTitle());
        System.out.println(event.getEvent_dis());
        LocalDate now = LocalDate.now();
        model.addAttribute(now);


        try {


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

            redirAttrs.addFlashAttribute("success", "Event created successfully .");
            return "redirect:/addevents/";
        }
        }
        catch(Exception e)
        {
            redirAttrs.addFlashAttribute("error", "Invalid input");
            return "redirect:/addevents/";
        }






        return "events/addevents";
    }


}
