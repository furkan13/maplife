package com.cardiff.maplife.repositories;

import com.cardiff.maplife.entities.Live;
import com.cardiff.maplife.entities.User;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface LiveRepository extends CrudRepository<Live, Long> {
    Live save(Live live);


    Live findByCohostid(long cohostid);

    List<Live> findByEventid(long eventid);
    @Modifying
    @Transactional
    @Query("select u from Live u where u.approved=false and u.eventid = (:eventid)")
    List<Live> findPendingByEventid(long eventid);
    @Modifying
    @Transactional
    @Query("select u from Live u where u.approved=true and u.eventid = (:eventid)")
    List<Live> findApprovedByEventid(long eventid);
    @Transactional
    void deleteByCohostid(long cohostid);
    void deleteAllByEventid(long eventid);
    void deleteLivesByEventid(long eventid);
    @Modifying
    @Transactional
    @Query("delete from Live u where u.eventid = (:eventid)")
    void deleteByEventid(long eventid);
}
