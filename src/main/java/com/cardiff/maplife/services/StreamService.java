package com.cardiff.maplife.services;

import com.cardiff.maplife.credentials.twilioClient;

import com.cardiff.maplife.entities.Event;
import com.cardiff.maplife.repositories.StreamRepository;
import org.springframework.stereotype.Service;

@Service
public class StreamService {
    public StreamRepository streamRepository;
    private twilioClient Client;


    public StreamService(StreamRepository streamRepository){
        this.streamRepository=streamRepository;
    }

    public Event saveEvent(Event event){

//        event.SetLink(Client.CreateRoom(event.GetTitle()));
        Client.CreateRoom(event.GetTitle());
        return streamRepository.save(event);
    }

}
