// $("#Steam") //streaming window
//Query string: room name
//Cache: username hashed
// import { Player } from '@twilio/live-player-sdk';
const QueryString = new URLSearchParams(window.location.search);
const room = QueryString.get("room");
let roomName = "TestingRoom";
if(room != null){
	roomName = room;
}
let roomObj = {room:"", tracks:"", token:"",VideoRoom:""};
let count = 0;
//user_name should be local stroage/cookie which is obtained when logging in
function main(){
	//What to do for connecting in twilio video room:
	//1. Create a room with unique room name
	//2. Get a token for that room with user name and room name
	//3. Create a local track to publish in the twilio video room
	//4. Connect to twilio video room with the token, localtrack and room name
	//5. Show other participant's tracks from the video room
	
	
    $("#video_rm").click(function(){
        video_reload();
		// console.log(liveToken)
	});
    $("#exit").click(function(){ room_exit(roomObj);});
    $("#partycheck").click(function(){ participant_video(roomObj);});
    $("#create_room").click(function(){room_create();});
	$("#delete_room").click(function(){room_delete();});

    $("#cohost_request").click(function(){cohost_send();});
    $("#cohost_list").click(function(){fetchCoHostRequest();});

//    live_token(liveToken)

}
const initlise = async function(){
	await video_room(); //Get the event from server
	if(roomObj.VideoRoom["title"] == ""){ //Server doesn't have the event entry of this roomname
		alert("Room name: "+roomName +" may be closed or not exist.\n Return to main page.");
		window.location.href = '../'; //Go back to main page
	}
	if(userJsonId == roomObj.VideoRoom["host_id"]){ //If the user is the host of this room
		//Build the host page accordingly
		
	}
	else{//Potential co-host, validate the user's id to server and check for token
		//Show black screen for loading, hide it after obtaining token
		
		//Call get token every minute, if server doesn't provide it for 5 times, return to live
		await co_host_token();
		//Checking for any token receive
		if(roomObj.token == ""){ //Alert user that host has not processed the request at the moment
			alert("Host has not replied at the moment. Please try it again or watch the streaming instead.")
			window.location.href = '../live?room='+roomName; //Go back to live page
		}
		//Hide the black screen 
		
		//Join the video room
		room_join(roomObj);
	}
}

function cohost_accept(){
    //get username from button's id to username
    let cohost_name;
    $.post("/CoHostAccept?RoomName="+roomName+"username="+cohost_name, function(data, status){

    });
}
function cohost_send(){

    $.post("/CoHostSubmit?RoomName="+roomName, function(data, status){

    });
}
function video_block(){ //Create block for multiple streamers' video
	$("#bottom_other_stream") //Target div

	
}
function participant_video_on_connect(){
	room.on('participantConnected', participant => {
	  console.log(`Participant "${participant.identity}" connected`);

	  participant.tracks.forEach(publication => {
		if (publication.isSubscribed) {
		  const track = publication.track;
		  document.getElementById('remote-media-div').appendChild(track.attach());
		}
	  });

	  participant.on('trackSubscribed', track => {
		document.getElementById('remote-media-div').appendChild(track.attach());
	  });
	});
}
function participant_video(roomObj){ //Show all the video of participant in the room
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
function room_exit(roomObj){ //Exit the room
    roomObj.room.on("disconnected", room =>{ //Notify other participant that this client is leaving
        room.localParticipant.tracks.forEach(publication => {
            const attachedElements = publication.track.detach();
            attachedElements.forEach(element => element.remove());
        })
    })
    roomObj.room.disconnect();
}
function GetTracks(roomObj){ //Obtain local audio/video tracks
	//Check if the user has video and audio device, return to live if no
	let device_check = [false,false];
	navigator.mediaDevices.enumerateDevices()
    .then((devices) => {
		devices.forEach((device) => {
			if(device.kind == "videoinput"){
				device_check[0] = true;
			}
			if(device.kind == "audioinput"){
				device_check[1] = true;
			}
		});
	})
	if(device_check[0] and device_check[1]){
		return Twilio.Video.createLocalTracks({audio: true, video: true}).then(function(localTracks){
			roomObj.tracks = localTracks;
			console.log(localTracks);
		});
	}

}
const room_join =async function(roomObj){ //Join the room with tracks
    await GetTracks(roomObj); //Get local tracks from user, saved in roomObj.tracks
    console.log(roomObj.tracks);

    await Twilio.Video.connect(roomObj.token, {name: roomName, tracks:roomObj.tracks}).then(room => {
        console.log(`Successfully joined a Room: ${room}`);
        roomObj.room = room;
        room.on('participantConnected', participant => {
            console.log(`A remote Participant connected: ${participant}`);

		});
	}, error => {
		console.error(`Unable to connect to Room: ${error.message}`);
	});
	participant_video(roomObj);
}
const room_create = async function(e){
    const event_object= {
        title: roomName
    }
    console.log(event_object);
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
function fetchCoHostRequest(){
    let interval = 5000; //5 second per request
    let cohostList = $.get("/CoHostRequest?RoomName="+roomName, function(data, status){
        console.log(data);
        setTimeout(fetchCoHostRequest,interval);
        for(let i =0; i < data.length(); i++){

        }
        return data;
    });
}
const room_delete = async function(e){ //Delete the room, should only allow host to do it
	const event_object= {
        title: roomName
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
function video_room(){ //Get event detail from server
	return $.get("/EventDetail?RoomName="+roomName, function(data,status){
		roomObj.VideoRoom = data;
	});
	
}
function co_host_token(){
	let interval = 60000; //60 second per request
	
    let cohostList = $.get("/EventAccessToken?RoomName="+roomName, function(data, status){
        // console.log(data);
		if(data !="" || count > 4){ //If host approved or 5 minutes passed
			roomObj.token = data;
			clearTimeout(co_host_token);
		}
		count +=1;
		setTimeout(co_host_token,interval);
    })
	
}
const video_token = async function(){ // Get video token if grant access
    //Backend: 1. Check if the user is allowed to stream
    //2. Check with host to see if they allow this user to stream
    let token = $.get("/EventAccessToken?RoomName="+roomName, function(data, status){
		return data;
	}); //Get the access token or reject if user is not authorised
    return token;
}

function live_token(token) { //Get live token for the room, required for all users
    token = $.get("/LiveAccess?RoomName=" + roomName); //Get the access token
    if (token == "") {//Show error with the room, might be closed
        $("#pop_up").innerHTML= "Room cannot be found"
        $("#pop_up").show();
    }
    return token;
}

$(document).ready(function(){
	main();
});