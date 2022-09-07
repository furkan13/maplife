package com.cardiff.maplife.services;



import com.cardiff.maplife.entities.Event;
import com.cardiff.maplife.repositories.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;


public interface EventService {



    public List<Event> findCustom(Timestamp serverTime);

    public List<Event> findAll();

    public Event findById(long eventId);

    public Event findByName(String name);

    public List<Event> finduserCustom(Timestamp serverTime, String username);

    public List<Event> finduserCustomNow(String username);

    public List<Event> finduserCustomUpcoming(Timestamp serverTime, String username);

    public Event save(Event event);

    public void deleteById(long eventId);

    public void deleteAll();


}
