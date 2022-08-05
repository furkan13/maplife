package com.cardiff.maplife.services;

import com.cardiff.maplife.entities.Event;
import com.cardiff.maplife.repositories.StreamRepository;
import org.springframework.stereotype.Service;

@Service
public class StreamService {
    public StreamRepository streamRepository;
    public StreamService(StreamRepository streamRepository){
        this.streamRepository=streamRepository;
    }

    public Event saveEvent(Event event){
        return streamRepository.save(event);
    }
}
