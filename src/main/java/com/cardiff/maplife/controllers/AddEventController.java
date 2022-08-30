package com.cardiff.maplife.controllers;


import ch.qos.logback.core.rolling.helper.PeriodicityType;
import com.cardiff.maplife.entities.Event;
import com.cardiff.maplife.entities.User;
import com.cardiff.maplife.fileUpload.EventFileUploadUtil;
import com.cardiff.maplife.services.EventService;
import com.cardiff.maplife.services.TwilioService;
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
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.websocket.server.PathParam;
import java.io.IOException;
import java.net.BindException;
import java.net.URI;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Date;
import java.sql.Time;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Period;
import java.util.List;
import java.util.concurrent.TimeUnit;

@RestController
public class AddEventController {


    @Autowired
    EventService eventService;
    @Autowired
    UserService userService;
    @Autowired
    TwilioService twilioService;

    @GetMapping("/addevents")
    public ModelAndView showForm(ModelAndView modelAndView, @ModelAttribute("events") Event event, Model model, @RequestParam(value = "image", required = false) MultipartFile file, @AuthenticationPrincipal User user, HttpSession session, RedirectAttributes redirAttrs, BindingResult result) throws IOException, NullPointerException{
        LocalDate now = LocalDate.now();
        model.addAttribute(now);

        modelAndView = new ModelAndView("/events/addevents");
        return modelAndView;
    }


    @PostMapping("/addevents")
    public ModelAndView addEvent(ModelAndView modelAndView, @ModelAttribute("events") Event event, Model model, @RequestParam(value = "image", required = false) MultipartFile file, @AuthenticationPrincipal User user, HttpSession session, RedirectAttributes redirAttrs,@RequestParam (required = false) String time,@RequestParam("tags")String checkboxValue) throws IOException, NullPointerException{

		event.setCat(checkboxValue);


		Event ServerEvent = null;
		try{
			ServerEvent = eventService.findByName(event.getTitle());
			//If there are event in server, do not allow adding event
		}
		catch(Exception e){
			ServerEvent = null;
		}
		//Check if the room title exist in database, check with live or future event(live = false)
		//!!!!! need new function in eventrepo!!!!!
		
		//Check with twilio room if the room name exist
		if(twilioService.CheckRoomExist(event) || ServerEvent != null) { //If there is existing room with the same name
			event.setTitle("Error");
			System.out.println("Room exist");
			
			//Show popup and Return to main page if room exist
			return new ModelAndView("redirect:/");
		}
		
		event.setUser(userService.findUserByUsername(user.getUsername()));
		try{
			DateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm");
			Date date = (Date) formatter.parse(time);
			event.setEvent_date(date);
		}
		catch(Exception e){
			return new ModelAndView("redirect:/");
		}
//		System.out.println(event.getTitle());
//		System.out.println(event.getEvent_date());
		Timestamp datetime = new Timestamp(System.currentTimeMillis());
		long diff=event.getEvent_date().getTime()-datetime.getTime();
		if(diff > 5){//Future event
			try{
				event.setLive(false); //Not in live
				event.setEvent_link("");//Empty link as twilio api is not called

				String fileName = "";
				fileName = StringUtils.cleanPath(file.getOriginalFilename()); //get the acrual file name
				event.setEventImageName(fileName);

				Event savedEvent = eventService.save(event);

				String uploadDir = "event/" + savedEvent.getId();
				EventFileUploadUtil.saveFile(uploadDir, fileName, file);


				return new ModelAndView("redirect:/streaming?room="+event.getTitle());
			}
			catch(Exception e){
				System.out.println("some error here...");
			
			}
			
		}
		else{ //Live event
			try {
				//Set event_date as current time

				datetime = new Timestamp(System.currentTimeMillis());
				event.setEvent_date(datetime);
				event.setLive(true);
				//Create twilio room and get url of the created room from twilio
				String link = (twilioService.CreateRoom(event));
				event.setEvent_link(link);
				
				
				String fileName = "";
				fileName = StringUtils.cleanPath(file.getOriginalFilename()); //get the acrual file name
				event.setEventImageName(fileName);
				Event savedEvent = eventService.save(event);
				String uploadDir = "event/" + savedEvent.getId();
				EventFileUploadUtil.saveFile(uploadDir, fileName, file);


				return new ModelAndView("redirect:/streaming?room="+event.getTitle());
			}
			catch (Exception e) {
				System.out.println("some error here...");
				
			}
		}
		//Return to main page if error 

        return new ModelAndView("redirect:/");
    }
}

















