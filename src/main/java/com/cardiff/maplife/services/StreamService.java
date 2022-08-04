package com.cardiff.maplife.services;

import com.cardiff.maplife.repositories.StreamRepository;
import com.cardiff.maplife.repositories.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class StreamService {
    public StreamRepository streamRepository;
    public StreamService(StreamRepository streamRepository){
        this.streamRepository=streamRepository;
    }

}
