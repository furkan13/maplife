package com.cardiff.maplife.repositories;
import com.cardiff.maplife.entities.Event;
import com.cardiff.maplife.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


import javax.transaction.Transactional;
import java.sql.Timestamp;
import java.util.List;


@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    Event save(Event event);
    @Modifying
    @Transactional
    @Query("select u from Event u where (u.live=true or u.event_date > (:serverTime)) and u.title =(:name)")
    List<Event> findTitleCustom(String name, Timestamp serverTime);

    @Modifying
    @Transactional
    @Query("select u from Event u where (u.live=true or u.event_date > (:serverTime)) and u.user.username =(:username)")
    List<Event> finduserCustom(Timestamp serverTime, String username);

    @Modifying
    @Transactional
    @Query("select u from Event u where u.live=true or u.event_date > (:serverTime)")
    List<Event> findCustom(Timestamp serverTime);

    @Modifying
    @Transactional
    @Query("select u from Event u where (u.live=true) and u.user.username =(:username)")
    List<Event> finduserCustomNow(String username);

    @Modifying
    @Transactional
    @Query("select u from Event u where (u.event_date > (:serverTime)) and u.user.username =(:username)")
    List<Event> finduserCustomUpcoming(Timestamp serverTime, String username);


}

