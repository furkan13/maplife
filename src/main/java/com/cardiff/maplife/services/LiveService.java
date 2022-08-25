package com.cardiff.maplife.services;

import com.cardiff.maplife.entities.Live;
import com.cardiff.maplife.entities.User;
import com.cardiff.maplife.repositories.EventRepository;
import com.cardiff.maplife.repositories.LiveRepository;
import com.cardiff.maplife.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class LiveService {
    private LiveRepository liveRepository;
    public LiveService(LiveRepository liveRepository){
        this.liveRepository=liveRepository;
    }

    public Live saveLive(Live live){
        return liveRepository.save(live);
    }
    public Live findLiveByUserid(long userId){
        return liveRepository.findByCohostid(userId);
    }
    public Set<Live> findLiveByEventid(long eventid){
        return liveRepository.findByEventid(eventid);
    }
    public void deleteLiveByCohostid(long userId){
        liveRepository.deleteByCohostid(userId);
    }
    public void deleteAllLiveByEventid(long eventid){
        liveRepository.deleteByEventid(eventid);
    }

}
