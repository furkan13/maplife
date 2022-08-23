package com.cardiff.maplife.repositories;

import com.cardiff.maplife.entities.Live;
import com.cardiff.maplife.entities.User;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import javax.transaction.Transactional;
import java.util.Optional;
import java.util.Set;

public interface LiveRepository extends CrudRepository<Live, Long> {
    Live save(Live live);


    Live findByCohostid(long cohostid);
    Set<Live> findByEventid(long eventid);
    void deleteByCohostid(long cohostid);
    void deleteAllByEventid(long eventid);
    void deleteLivesByEventid(long eventid);
    @Modifying
    @Transactional
    @Query("delete from Live u where u.eventid = (:eventid)")
    void deleteByEventid(long eventid);
}
