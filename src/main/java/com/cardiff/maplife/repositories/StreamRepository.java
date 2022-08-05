package com.cardiff.maplife.repositories;

import com.cardiff.maplife.entities.Event;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StreamRepository extends CrudRepository<Event, Long> {
    Event save(Event event);
}
