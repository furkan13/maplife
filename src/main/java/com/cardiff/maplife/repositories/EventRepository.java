package com.cardiff.maplife.repositories;

import com.cardiff.maplife.entities.Event;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventRepository extends CrudRepository<Event, Long> {
    Event save(Event event);

}
