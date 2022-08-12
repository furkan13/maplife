package com.cardiff.maplife.credentials;

import com.twilio.Twilio;
import com.twilio.jwt.accesstoken.AccessToken;
import com.twilio.jwt.accesstoken.VideoGrant;
import com.twilio.rest.video.v1.Room;

public class twilioClient {

    private static final String account_SID = "AC4f1b3c945710a74853766fd59071a9aa";
    private static final String api_key = "SK77d0e7f064cc1a3c5d8fdd73cf1bf22d";
    private static final String api_secret = "OH4sRv0f2d6UXj32ZY8biCI1QNCSnKdx";
    private static final String token ="32378018f4a80f106e6f4a2727b9066b";

    public twilioClient(){
//        String id ="Jeff";
//        VideoGrant grant = new VideoGrant().setRoom("Jeff room");
//        AccessToken token = new AccessToken.Builder(
//                account_SID,
//                api_key,
//                api_secret
//        ).identity(id).grant(grant).build();

    }
    public Boolean CheckRoomExist(String RoomName){
        Twilio.init(account_SID,token);
        Room room = Room.fetcher(RoomName).fetch();
        System.out.println(room.getStatus());
        return true;
    }
    public String CreateRoom(String RoomName){
        Twilio.init(account_SID,token);
//        Room rm = Room.fetcher("Jeff").fetch();
//        Room del = Room.updater(rm.getSid(), Room.RoomStatus.COMPLETED).update();
        //Check whether the room name is taken first

        Room room = Room.creator()
//                .setStatusCallback(URI.create("http://example.org"))
                .setType(Room.RoomType.PEER_TO_PEER)
                .setUniqueName(RoomName)
                .create();

        return room.getUrl().toString();
    }

}
