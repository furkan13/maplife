package com.cardiff.maplife.controllers;

import com.cardiff.maplife.services.StreamService;
import com.cardiff.maplife.services.UserService;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StreamController {
    private final StreamService streamService;

    public StreamController(StreamService streamService){
        this.streamService=streamService;
    }


}
