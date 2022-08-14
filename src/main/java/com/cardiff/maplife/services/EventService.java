package com.cardiff.maplife.services;



import com.cardiff.maplife.entities.Event;
import com.cardiff.maplife.repositories.EventRepository;
import org.springframework.stereotype.Service;

@Service
public class EventService {
    public EventRepository eventRepository;



    public EventService(EventRepository eventRepository){
        this.eventRepository=eventRepository;

    }

    public Event saveEvent(Event event){

        return eventRepository.save(event);
    }

}
