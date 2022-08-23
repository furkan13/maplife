package com.cardiff.maplife.repositories;

import com.cardiff.maplife.entities.Live;
import com.cardiff.maplife.entities.User;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;
import java.util.Set;

public interface LiveRepository extends CrudRepository<Live, Long> {
    Live save(Live live);


    Live findByCohostid(long cohostid);
    Set<Live> findByEventid(long eventid);
    void deleteByCohostid(long cohostid);
    void deleteAllByEventid(long eventid);
}
