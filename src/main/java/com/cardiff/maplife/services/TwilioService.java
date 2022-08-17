package com.cardiff.maplife.services;

import com.cardiff.maplife.Config.TwilioConfig;
import com.cardiff.maplife.entities.Event;
import com.twilio.Twilio;
import com.twilio.jwt.accesstoken.AccessToken;
import com.twilio.jwt.accesstoken.VideoGrant;
import com.twilio.rest.video.v1.Room;
import org.springframework.stereotype.Service;

@Service
public class TwilioService {


    public Boolean CheckRoomExist(Event event){
        try{ //if room exist
            Room room = Room.fetcher(event.getEvent_title()).fetch();
            System.out.println(room.getStatus());
            return true;
        }
        catch(Exception e) {//room not exist, search for database to delete it

            return false;
        }
    }
    public String CreateRoom(Event event){

//        Room rm = Room.fetcher("Jeff").fetch();
//        Room del = Room.updater(rm.getSid(), Room.RoomStatus.COMPLETED).update();
        //Check whether the room name is taken first
//        System.out.println(event.getEvent_title());
        Room room = Room.creator()
//                .setStatusCallback(URI.create("http://example.org"))
                .setType(Room.RoomType.PEER_TO_PEER)
                .setUniqueName(event.getEvent_title())
                .create();

        return room.getUrl().toString();
    }
    public void DeleteRoom(Event event){
        try {
            Room room = Room.updater(
                            event.getEvent_title(), Room.RoomStatus.COMPLETED)
                    .update();

        }
        catch(Exception e){
            System.out.println("Room not found. cannot be deleted");
        }
    }
    public String EventAccessToken(String UserName, String RoomName){
        VideoGrant grant = new VideoGrant().setRoom(RoomName);
        final TwilioConfig TwilioConfig= new TwilioConfig();
        AccessToken token = new AccessToken.Builder(
                TwilioConfig.GetSID(),
                TwilioConfig.GetAPI_Key(),
                TwilioConfig.GetAPI_Secret()
        ).identity(UserName).grant(grant).build();
        System.out.println(token.toJwt());
        return token.toJwt();
    }
}
