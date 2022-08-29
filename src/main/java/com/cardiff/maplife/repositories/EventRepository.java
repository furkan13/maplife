package com.cardiff.maplife.repositories;

import com.cardiff.maplife.entities.Event;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import javax.transaction.Transactional;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    Event save(Event event);
    Optional <Event> findByTitle(String name);

    @Modifying
    @Transactional
    @Query("select u from Event u where u.live=true or u.event_date > (:serverTime)")
    List<Event> findCustom(Timestamp serverTime);
}

