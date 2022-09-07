package com.cardiff.maplife.services;

import com.cardiff.maplife.config.TwilioConfig;
import com.cardiff.maplife.entities.Event;
import com.cardiff.maplife.entities.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.twilio.base.ResourceSet;
import com.twilio.http.HttpMethod;
import com.twilio.jwt.accesstoken.AccessToken;
import com.twilio.jwt.accesstoken.ChatGrant;
import com.twilio.jwt.accesstoken.VideoGrant;
import com.twilio.rest.conversations.v1.Conversation;
import com.twilio.rest.conversations.v1.Role;
import com.twilio.rest.media.v1.MediaProcessor;
import com.twilio.rest.media.v1.PlayerStreamer;
import com.twilio.rest.media.v1.playerstreamer.PlaybackGrant;
import com.twilio.rest.video.v1.Room;
import com.twilio.rest.video.v1.room.Participant;
import com.twilio.rest.video.v1.room.participant.SubscribeRules;
import com.twilio.type.Rule;
import com.twilio.type.SubscribeRule;
import com.twilio.type.SubscribeRulesUpdate;
import org.apache.commons.io.IOUtils;
import org.assertj.core.util.Lists;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class TwilioService {


    public Boolean CheckRoomExist(Event event){
        try{ //if room exist
            Room room = Room.fetcher(event.getRoom_sid()).fetch();
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
                .setType(Room.RoomType.GO) //Testing with free rtc service
                .setStatusCallback(URI.create("https://18.168.158.246/roomStatus"))
                .setStatusCallbackMethod(HttpMethod.POST)
                .setUniqueName(event.getTitle())
                .setEmptyRoomTimeout(15)//15 minutes timeout
                .create();

        return room.getSid().toString();
    }
    public void KickCohost(String RoomName,String UserName){
        Participant participant = com.twilio.rest.video.v1.room.Participant.updater(RoomName,UserName)
                .setStatus(com.twilio.rest.video.v1.room.Participant.Status.DISCONNECTED).update();
    }
    public void DeleteRoom(Event event){
        try {
            Room room = Room.updater(
                            event.getRoom_sid(), Room.RoomStatus.COMPLETED)
                    .update();

        }
        catch(Exception e){
            System.out.println("Room not found. cannot be deleted");
        }
    }
    public void ChatKickUser(String UserName, String RoomName){
        com.twilio.rest.conversations.v1.conversation.Participant.deleter(RoomName,UserName);
    }
    public String ChatAccessToken(String UserName, Event event) {
        final TwilioConfig TwilioConfig= new TwilioConfig();
        ChatGrant grant = new ChatGrant();
        grant.setServiceSid(TwilioConfig.GetChat());
        AccessToken token = new AccessToken.Builder(
                TwilioConfig.GetSID(),
                TwilioConfig.GetAPI_Key(),
                TwilioConfig.GetAPI_Secret()
        ).identity(UserName).grant(grant).build();
        //Set the user in the room
//        Role normalUser = Role.creator("MapLife", Role.RoleType.CONVERSATION, Arrays.asList("")).create();
//        System.out.println(normalUser.getPermissions());
//        .setRoleSid(normalUser.getSid())

        Conversation conversation = Conversation.fetcher(event.getChat_sid()).fetch();

        try {
            com.twilio.rest.conversations.v1.conversation.Participant participant = com.twilio.rest.conversations.v1.conversation.Participant.creator(conversation.getSid()).setIdentity(UserName).create();
            System.out.println(participant.toString());
        }catch(Exception e){
            System.out.println("failed");
        }
        //        System.out.println(token.toJwt());
        return token.toJwt();
    }
    public void DeleteChatRoom(Event event){
        Conversation.deleter(event.getChat_sid());
    }
    public String CreatChatRoom(Event event){
        Conversation conversation = Conversation.creator()
                .setFriendlyName("MapLife")
                .setUniqueName(event.getTitle())
                .create();
        System.out.println(conversation.getUrl());
        return conversation.getSid().toString();
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
    public String createPlayerStreamer(){ //Create a player that send data to viewers
        PlayerStreamer playerStreamer = PlayerStreamer.creator().create();
        return playerStreamer.getSid();
    }
    public boolean deletePlayerStreamer(String sid){//Delete when it is not used
        try{
            PlayerStreamer.updater(sid, PlayerStreamer.UpdateStatus.ENDED);
            return true;
        }
        catch(Exception e){
            return false;
        }
    }
    public String createMediaProcessor(String roomID,String streamerID){//Listener to twilio video room
        MediaProcessor mediaProcessor = MediaProcessor.creator(
                "video-composer-v2",
                "{\"identity\": \"video-composer-v2\",\"room\":{\"name\":\"" +roomID+"\"}, \"outputs\": [\""+streamerID+"\"], \"audioBitrate\":128, \"resolution\": \"1280x720\", \"video\": true}")
                .create();

        return mediaProcessor.getSid();
    }
    public void deleteMediaProcessor(String processorId){
        try {
            MediaProcessor mediaProcessor = MediaProcessor.updater(
                            processorId,
                            MediaProcessor.UpdateStatus.ENDED)
                    .update();
        }
        catch(Exception e){

        }
    }
    public String LiveTokenGenerate(String streamerId){//A token for streamer
        PlaybackGrant playbackGrant = com.twilio.rest.media.v1.playerstreamer.PlaybackGrant.creator(streamerId)
                .setTtl(10)
                .create();
        com.twilio.jwt.accesstoken.PlaybackGrant wrapped = new com.twilio.jwt.accesstoken.PlaybackGrant().setGrant(playbackGrant.getGrant());
        final TwilioConfig TwilioConfig= new TwilioConfig();
        AccessToken token = new AccessToken.Builder(
                TwilioConfig.GetSID(),
                TwilioConfig.GetAPI_Key(),
                TwilioConfig.GetAPI_Secret()
        ).grant(wrapped).build();
        return token.toJwt();

    }
    public void StreamerJoinedRules(Event eventCache,List<User> cohost, User host){ //Set only subscribe to host and cohost, default none
        //Get list of participants in the room, set rules in them to exclude all tracks except cohost and host
        //Only call when there are changes in room, i.e. new or kicked cohost
        Room room_target = Room.fetcher(eventCache.getRoom_sid())
                .fetch();
        ResourceSet<Participant> participants =
                Participant.reader(eventCache.getRoom_sid())
                        .setStatus(Participant.Status.CONNECTED)
                        .read();
//        Room room_target;
        List<SubscribeRule> ruleset = new ArrayList<>();
        ruleset.add(SubscribeRule.builder() //Disable all by default
                .withType(SubscribeRule.Type.EXCLUDE).withAll()
                .build());
        for(int i =0; i< cohost.size();i++){
            ruleset.add(SubscribeRule.builder() //Only show video of the cohost
                    .withType(SubscribeRule.Type.INCLUDE).withPublisher(cohost.get(i).getUsername())
                    .withKind(SubscribeRule.Kind.VIDEO)
                    .build());
        }
        ruleset.add(SubscribeRule.builder()
                .withType(SubscribeRule.Type.INCLUDE).withPublisher(host.getUsername())
                .build());
        SubscribeRulesUpdate UpdatedRules = new SubscribeRulesUpdate((ruleset));

            //loop for all participant
            for(Participant users: participants){ //Update to all connected user
                System.out.println(users.getIdentity());
                SubscribeRules rules = SubscribeRules
                        .updater(room_target.getSid(),users.getIdentity())
                        .setRules(new ObjectMapper().convertValue(UpdatedRules, Map.class))
                        .update();
            }




    }
    public void ViewerJoinedRules(Event eventCache, User currentUser,List<User> cohost, User host){
        //New user join the live, set their sub rules to allow host video&audio and cohost video only
        Room room_target = Room.fetcher(eventCache.getRoom_sid())
                .fetch();
//        Room room_target;
        List<SubscribeRule> ruleset = new ArrayList<>();
        ruleset.add(SubscribeRule.builder() //Disable all by default
                .withType(SubscribeRule.Type.EXCLUDE).withAll()
                .build());
        for(int i =0; i< cohost.size();i++){
            ruleset.add(SubscribeRule.builder() //Only show video of the cohost
                    .withType(SubscribeRule.Type.INCLUDE).withPublisher(cohost.get(i).getUsername())
                    .withKind(SubscribeRule.Kind.VIDEO)
                    .build());
        }
        ruleset.add(SubscribeRule.builder()
                .withType(SubscribeRule.Type.INCLUDE).withPublisher(host.getUsername())
                .build());
        SubscribeRulesUpdate UpdatedRules = new SubscribeRulesUpdate((ruleset));

            //Targeting the user just join the room
            SubscribeRules rules = SubscribeRules
                    .updater(room_target.getSid(),currentUser.getUsername())
                    .setRules(new ObjectMapper().convertValue(UpdatedRules, Map.class))
                    .update();

    }


}

