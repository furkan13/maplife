$("#Steam") //streaming window
//Query string: room name
//Cache: username hashed
// import { Player } from '@twilio/live-player-sdk';
const QueryString = new URLSearchParams(window.location.search);
// const room = QueryString.get("room");
const roomName = "JeffRoom";
let player;
var user_name="Jeff";
let roomObj = {room:""};
let roomToken, liveToken ="";
//user_name should be local stroage/cookie which is obtained when logging in
function main(){

    $("#video_rm").click(function(){
        liveToken = user_check(roomToken)
        let response;
        liveToken.then((response)=> {
            console.log(response);
            room_join(response,roomObj);
        })
		// console.log(liveToken)

	});
    $("#exit").click(function(){ room_exit(roomObj);});
    $("#partycheck").click(function(){ participant_video(roomObj);});
    $("#create_room").click(function(){room_create();});
	$("#delete_room").click(function(){room_delete();});
//    live_token(liveToken)
    if(liveToken != ""){
        init_player(player,liveToken);
        $("#Steam").appendChild(player.videoElement);
    }
    console.log(liveToken,roomToken);
}
function participant_video(roomObj){
    roomObj.room.participants.forEach(participant => {
        participant.tracks.forEach(publication => {
            if(publication.track){
                document.getElementById("stream").appendChild(publication.track.attach());
            }
        });
        participant.on("trackSubscribed",track =>{
            document.getElementById("stream").appendChild(track.attach());
        });
    });
}
function room_exit(roomObj){
    roomObj.room.on("disconnected", room =>{ //Notify other participant that this client is leaving
        room.localParticipant.tracks.forEach(publication => {
            const attachedElements = publication.track.detach();
            attachedElements.forEach(element => element.remove());
        })
    })
    roomObj.room.disconnect();
}
function room_join(token,roomObj){

    Twilio.Video.connect(token, {name: "JeffRoom"}).then(room => {
        console.log(`Successfully joined a Room: ${room}`);
        roomObj.room = room;
        room.on('participantConnected', participant => {
            console.log(`A remote Participant connected: ${participant}`);

	});
}, error => {
	console.error(`Unable to connect to Room: ${error.message}`);
});

}
const room_create = async function(e){
    const event_object= {
        event_title: "JeffRoom"
    }
    const response = await fetch("/RoomCreation", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(event_object),
            })
            if (response.status == "200") {
                        const data = await response.json();
                        console.log(data);
                        // window.location.href="/stream"
                    }


//    $.post("/RoomCreation", event_object);
}
const room_delete = async function(e){
	const event_object= {
        event_title: "JeffRoom"
    }
    const response = await fetch("/RoomDeletion", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(event_object),
            })
            if (response.status == "200") {
                        // const data = await response.json();
                        console.log("deleted");
                        // window.location.href="/stream"
                    }


}
const user_check = async function(token){ //Check for hashed user name for identity, Get video token if grant access
    //Backend: 1. Check if the user is allowed to stream
    //2. Check with host to see if they allow this user to stream
    token = $.get("/EventAccessToken?user="+user_name+"&room="+roomName, function(data, status){
		return data;
	}); //Get the access token or reject if user is not authorised
    if(token == ""){//Show user not enough coins
        $("#pop_up").innerHTML= "You are not allowed to stream in this room"
        $("#pop_up").show();
        return;
    }
    return token;
}

function live_token(token) { //Get live token for the room, required for all users
    token = $.get("/LiveAccess?room=" + roomName); //Get the access token
    if (token == "") {//Show error with the room, might be closed
        $("#pop_up").innerHTML= "Room cannot be found"
        $("#pop_up").show();
    }
    return token;
}
async function init_player(player,token) {
    const {
        host,
        protocol,
    } = window.location;
    player = await Twilio.Live.Player.connect(token, {
        playerWasmAssetsPath: `${protocol}//${host}/path/to/hosted/player/assets`,
    });
    return player;
}
$(document).ready(function(){
	main();
});