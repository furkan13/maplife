package com.cardiff.maplife.services;



import com.cardiff.maplife.entities.Event;
import com.cardiff.maplife.repositories.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


public interface EventService {





    public List<Event> findAll();

    public Event findById(long eventId);

    public Event findByName(String name);

    public Event save(Event event);

    public void deleteById(long eventId);

    public void deleteAll();


}
