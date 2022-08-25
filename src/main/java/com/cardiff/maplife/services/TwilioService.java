package com.cardiff.maplife.services;

import com.cardiff.maplife.Config.TwilioConfig;
import com.cardiff.maplife.entities.Event;
import com.twilio.Twilio;
import com.twilio.http.HttpMethod;
import com.twilio.jwt.accesstoken.AccessToken;
import com.twilio.jwt.accesstoken.VideoGrant;
import com.twilio.rest.video.v1.Room;
import com.twilio.rest.video.v1.room.Participant;
import org.springframework.stereotype.Service;

import java.net.URI;

@Service
public class TwilioService {


    public Boolean CheckRoomExist(Event event){
        try{ //if room exist
            Room room = Room.fetcher(event.getTitle()).fetch();
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
                .setStatusCallback(URI.create("https://8b35-131-251-33-213.eu.ngrok.io/roomStatus"))
                .setStatusCallbackMethod(HttpMethod.POST)
                .setUniqueName(event.getTitle())
                .setEmptyRoomTimeout(15)//15 minutes timeout
                .create();

        return room.getUrl().toString();
    }
    public void KickCohost(String RoomName,String UserName){
        Participant participant = com.twilio.rest.video.v1.room.Participant.updater(RoomName,UserName)
                .setStatus(com.twilio.rest.video.v1.room.Participant.Status.DISCONNECTED).update();
    }
    public void DeleteRoom(Event event){
        try {
            Room room = Room.updater(
                            event.getTitle(), Room.RoomStatus.COMPLETED)
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
//        System.out.println(token.toJwt());
        return token.toJwt();
    }
}

