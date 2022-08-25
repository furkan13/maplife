package com.cardiff.maplife.credentials;

import com.cardiff.maplife.config.TwilioConfig;
import com.twilio.Twilio;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TwilioClient {

    private final static Logger LOGGER = LoggerFactory.getLogger(TwilioClient.class);
    private final TwilioConfig TwilioConfig;

//        String id ="Jeff";
//        VideoGrant grant = new VideoGrant().setRoom("Jeff room");
//        AccessToken token = new AccessToken.Builder(
//                account_SID,
//                api_key,
//                api_secret
//        ).identity(id).grant(grant).build();
    @Autowired
    public TwilioClient(TwilioConfig TwilioConfig){
        this.TwilioConfig = TwilioConfig;
        Twilio.init(TwilioConfig.GetSID(),TwilioConfig.GetToken());
        LOGGER.info("Twilio initlised");
    }


//    public Boolean CheckRoomExist(String RoomName){
//        Twilio.init(account_SID,token);
//        Room room = Room.fetcher(RoomName).fetch();
//        System.out.println(room.getStatus());
//        return true;
//    }
//    public String CreateRoom(String RoomName){
//        Twilio.init(account_SID,token);
////        Room rm = Room.fetcher("Jeff").fetch();
////        Room del = Room.updater(rm.getSid(), Room.RoomStatus.COMPLETED).update();
//        //Check whether the room name is taken first
//        System.out.println(RoomName);
//        Room room = Room.creator()
////                .setStatusCallback(URI.create("http://example.org"))
//                .setType(Room.RoomType.PEER_TO_PEER)
//                .setUniqueName(RoomName)
//                .create();
//
//        return room.getUrl().toString();
//    }

}
