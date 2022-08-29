package com.cardiff.maplife.services;

import com.cardiff.maplife.entities.Live;
import com.cardiff.maplife.entities.User;
import com.cardiff.maplife.repositories.EventRepository;
import com.cardiff.maplife.repositories.LiveRepository;
import com.cardiff.maplife.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
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
    public Live findLiveByUserid(long userId, long eventid){
        List<Live> cache= liveRepository.findByCohostidAndEventid(userId,eventid);
        if(cache.size() > 0){
            return cache.get(0);
        }
        return null;

    }
    public List<Live> findAllLiveByEventid(long eventid){
        return liveRepository.findByEventid(eventid);
    }
    public List<Live> findPendingLiveByEventid(long eventid){
        return liveRepository.findPendingByEventid(eventid);
    }

    public void deleteLiveByCohostid(long userId, long eventid){
        liveRepository.deleteByCohostid(userId,eventid);
    }
    public void deleteAllLiveByEventid(long eventid){
        liveRepository.deleteByEventid(eventid);
    }

}
