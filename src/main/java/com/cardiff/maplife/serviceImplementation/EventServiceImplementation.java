package com.cardiff.maplife.serviceImplementation;

import com.cardiff.maplife.entities.Event;
import com.cardiff.maplife.repositories.EventRepository;
import com.cardiff.maplife.services.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventServiceImplementation implements EventService {
    @Autowired
    private EventRepository eventRepository;


    @Override
    public List<Event> findAll()
    {
        return eventRepository.findAll();
    }

    @Override
    public Event findById(int eventId)
    {
        Optional<Event> result = eventRepository.findById(eventId);

        Event event = null;

        if (result.isPresent()) {
            event= result.get();
        } else {

            throw new RuntimeException("Did not find desk - " + eventId);
        }

        return event;
    }

    @Override
    public Event findByName(String name)
    {
        Optional<Event> result = eventRepository.findByTitle(name);

        Event event = null;

        if (result.isPresent()) {
            event= result.get();
        } else {

            throw new RuntimeException("Did not find desk - " + name);
        }

        return event;
    }

    @Override
    public void save(Event event)
    {
        eventRepository.save(event);
    }
    @Override
    public void deleteById(int eventId)
    {
        eventRepository.deleteById(eventId);
    }
    @Override
    public void deleteAll()
    {
        eventRepository.deleteAll();
    }







}
