package com.cardiff.maplife.serviceImplementation;

import com.cardiff.maplife.entities.Event;
import com.cardiff.maplife.repositories.EventRepository;
import com.cardiff.maplife.services.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Service
public class EventServiceImplementation implements EventService {
    @Autowired
    private EventRepository eventRepository;
    private EventService eventService;

    @Override
    public List<Event> findAll()
    {
        return eventRepository.findAll();
    }

    @Override
    public List<Event> findCustom(Timestamp serverTime)
    {
        return eventRepository.findCustom(serverTime);
    }

    @Override
    public Event findById(long eventId)
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
    public Event save(Event event)
    {
        return eventRepository.save(event);
    }
    @Override
    public void deleteById(long eventId)
    {
        eventRepository.deleteById(eventId);
    }
    @Override
    public void deleteAll()
    {
        eventRepository.deleteAll();
    }







}
