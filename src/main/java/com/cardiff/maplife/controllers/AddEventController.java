package com.cardiff.maplife.controllers;


import ch.qos.logback.core.rolling.helper.PeriodicityType;
import com.cardiff.maplife.entities.Event;
import com.cardiff.maplife.entities.User;
import com.cardiff.maplife.fileUpload.EventFileUploadUtil;
import com.cardiff.maplife.services.EventService;
import com.cardiff.maplife.services.UserService;
import net.sf.jsqlparser.expression.DateTimeLiteralExpression;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.websocket.server.PathParam;
import java.io.IOException;
import java.net.BindException;
import java.net.URI;
import java.sql.Timestamp;
import java.util.Date;
import java.sql.Time;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Period;
import java.util.concurrent.TimeUnit;

@RestController
public class AddEventController {


    @Autowired
    EventService eventService;
    @Autowired
    UserService userService;


    @GetMapping("/addevents")
    public ModelAndView showForm(ModelAndView modelAndView, @ModelAttribute("events") Event event, Model model, @RequestParam(value = "image", required = false) MultipartFile file, @AuthenticationPrincipal User user, HttpSession session, RedirectAttributes redirAttrs, BindingResult result) throws IOException, NullPointerException{
        LocalDate now = LocalDate.now();
        model.addAttribute(now);

        modelAndView = new ModelAndView("/events/addevents");
        return modelAndView;
    }


    @PostMapping("/addevents")
    public ModelAndView addEvent(ModelAndView modelAndView, @ModelAttribute("events") Event event, Model model, @RequestParam(value = "image", required = false) MultipartFile file, @AuthenticationPrincipal User user, HttpSession session, RedirectAttributes redirAttrs,@RequestParam (required = false) String time) throws IOException, NullPointerException{
        LocalDate now = LocalDate.now();


        System.out.println(time);


        String fileName = "";
        try {
            fileName = StringUtils.cleanPath(file.getOriginalFilename()); //get the acrual file name
            event.setEventImageName(fileName);
            System.out.println(fileName);


        } catch (Exception e) {

        }


        if (event.getTitle() != null) {


            event.setHost_id(user.getId());




            Timestamp datetime = new Timestamp(System.currentTimeMillis());
            try {
                DateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm");
                Date date = (Date) formatter.parse(time);
                event.setEvent_date(date);

            }
            catch (Exception e)
            {

            }

            event.setUser(userService.findUserByUsername(user.getUsername()));



            eventService.save(event);



            //sending upload dir,filename and the file to the upload utility


            long diff=event.getEvent_date().getTime()-datetime.getTime();
            long minutes = TimeUnit.MILLISECONDS.toMinutes(diff);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Event> requestEntity = new HttpEntity<>(event, headers);
            System.out.println(event.getId());


            if(diff<5)
            {


                String uri = "http://localhost:8080/RoomCreation";
                RestTemplate restTemplate = new RestTemplate();
                ResponseEntity<Event> resp = new ResponseEntity(headers, HttpStatus.OK);
                resp = restTemplate.postForObject(uri,requestEntity,ResponseEntity.class);

            }
            else {

                String uri = "http://localhost:8080/RoomFutureCreation";
                RestTemplate restTemplate = new RestTemplate();
                ResponseEntity<Event> resp = new ResponseEntity(headers, HttpStatus.OK);
                resp = restTemplate.postForObject(uri, requestEntity, ResponseEntity.class);
            }
            String uploadDir = "event/" + event.getId();
            EventFileUploadUtil.saveFile(uploadDir, fileName, file);

        }


        modelAndView = new ModelAndView("redirect:/streaming?room="+event.getTitle());

        return modelAndView;
    }
}

















