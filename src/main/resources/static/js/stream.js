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
let local_track = [[[],[],[]],[[],[],[]]];//[n][0]:Video,[n][1]:Speaker,[n][2]:Mic, n=0: id, n=1: tag
let count = 0;
//user_name should be local stroage/cookie which is obtained when logging in
let userJsonId=2;
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
	initlise();
}
function mic_replay(target,source){
	target[0].muted = true;
	if(source.is(":checked")){
		target[0].muted = false;
	}
}
const initlise = async function(){
	await video_room(); //Get the event from server
	$("#user_video").change(function(){switch_video($("#video_target"),$("#user_video"))})
	$("#user_mic").change(function(){switch_mic($("#speaker_target"),$("#user_mic"),"Testing")})
	$("#user_speaker").change(function(){switch_speaker($("#speaker_target"),$("#user_speaker"))})
	$("#test_audio").click(function(){$("#audiodemo")[0].play();});
	$("#audioreplay").click(function(){mic_replay($(".Testing"),$("#audioreplay"))})
	//Show black screen for loading, hide it after obtaining token
	//Create function for user to choose tracks, listen to playback and video
	//Cancel button to return to live/main page according to users' identity(host/cohost)
	let blackscreen = $("#blackscreen"); //Default blackscreen before connecting to the room
	loading_page();
	
	if(roomObj.VideoRoom["title"] == null){ //Server doesn't have the event entry of this roomname
		alert("Room name: "+roomName +" may be closed or not exist.\n Return to main page.");
		window.location.href = '../'; //Go back to main page
	}
	if(userJsonId == roomObj.VideoRoom["host_id"]){ //If the user is the host of this room
		//Build the host page accordingly
		//Show submit button and add event listener
		await video_token(); //Get token before letting host to join the room
		$("#join_room_btn").click(function(){
			blackscreen.hide();
			$("#speaker_target").empty();
			$("#video_target").empty();
			room_join(roomObj);
		})
		$("#join_room_btn").show();
		//Set cancel button to delete the room and return to main page. Also ask to confirm.
		$("#cancel_btn").click(function(){
			let answer = window.confirm("Return to main page? Room will be deleted");
			if(answer){
				room_delete();
				window.location.href = '../';
			}
		})
	}
	else{//Potential co-host, validate the user's id to server and check for token
		//Set cancel button to go back live page.
		$("#cancel_btn").click(function(){
			let answer = window.confirm("Return to live page?");
			if(answer){
				window.location.href = '../live?room='+roomName;
			}
		})
		$("#loading_animation").show(); //Show the loading animation

		//Call get token every 15s, if server doesn't provide it for 5 minutes, return to live
		await video_token();
		while(count < 19 && roomObj.token ==""){

			await sleep(15000);
			video_token();
			// console.log("ha")
			count+=1;
		}

		//Checking for any token receive
		if(roomObj.token == ""){ //Alert user that host has not processed the request at the moment
			alert("Host has not replied at the moment. Please try it again or watch the streaming instead.")
			window.location.href = '../live?room='+roomName; //Go back to live page
		}
		$("#loading_animation").hide(); //Hide the loading animation
		//Hide the black screen after clicking join button
		$("#join_room_btn").click(function(){
			blackscreen.hide();
			$("#speaker_target").empty();
			$("#video_target").empty();
			room_join(roomObj);
		})
		$("#join_room_btn").show();

		

	}
}
function sleep(ms){
	return new Promise(resolve => setTimeout(resolve,ms));
}
function switch_video(target, listvideo){ //User changing video source, input: target of the video, select list
	roomObj.tracks[1].stop();//Stop current video stream
	Twilio.Video.createLocalTracks({video:{deviceId:{exact:listvideo.val()}}}).then((stream)=>{
		roomObj.tracks[1] = stream[0];
		target.empty();//Clear the previous track in show
		target.append(roomObj.tracks[1].attach());
	})
}
function switch_mic(target, listmic, className){ //Change the device for audio
	roomObj.tracks[0].stop();
	Twilio.Video.createLocalTracks({audio:{deviceId:{exact:listmic.val()}}}).then((stream)=>{
		roomObj.tracks[0] = stream[0];
		//Make an id for the audio, so doesn't delete all
		let cache = roomObj.tracks[0].attach();
		cache.className = (className) ;
		$("."+className).remove();//Clear the previous track in show
		target.append(cache);
	})
}
function switch_speaker(target, listspeaker){
	for(let i =0; i< target[0].childNodes.length; i++){
		if(target[0].childNodes[i].tagName == "AUDIO"){
			target[0].childNodes[i].setSinkId(listspeaker.val())
		}
	}
}
function get_track_list(){ //Doesn't work in local file, try localhost
	local_track =[[[],[],[]],[[],[],[]]];
	let stream;
	return navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(s=>{
		stream = s;
		if (!navigator.mediaDevices?.enumerateDevices) {
			console.log("enumerateDevices() not supported.");
		} else {
			return navigator.mediaDevices.enumerateDevices()
			.then((devices) => {
				devices.forEach((device) => {
					// console.log(device.label);
					if(device.kind == "videoinput"){
						local_track[0][0].push(device.deviceId);
						local_track[1][0].push(device.label);
					}
					if(device.kind == "audiooutput"){
						local_track[0][1].push(device.deviceId);
						local_track[1][1].push(device.label);
					}
					if(device.kind == "audioinput"){
						local_track[0][2].push(device.deviceId);
						local_track[1][2].push(device.label);
					}
					
				}

				);
			})

		}

	})

}
const loading_page = async function(){ //Setup for the blackscreen, provide video,audio preview
	await get_track_list();

	let target_list = [$("#user_video"),$("#user_speaker"),$("#user_mic")]
	let cache;
	for(let i =0; i< 3;i++){
		target_list[i].empty(); //Empty the child list if this function called more than once
		// 	console.log(local_track[0][i]);
		for(let j=0; j<local_track[0][i].length; j++){ //Create an option for each possible tracks
			//Option tag for media choices
			cache = "<option value='"+local_track[0][i][j]+"'>"+local_track[1][i][j]+"</option>";

			// console.log(cache);
			target_list[i].append(cache);
		}
	}
	//Set to default video/microphone, show it on webpage

	Twilio.Video.createLocalTracks({audio:{deviceId:{exact:local_track[0][2][0]}}, video:{deviceId:{exact:local_track[0][0][0]}}})
		.then((stream)=> {
			roomObj.tracks = stream; //Store the tracks in roomObj

			$("#video_target").empty();//Clear the previous track in show
			$(".Testing").remove();

			//Make an id for the audio, so doesn't delete all
			let cache = roomObj.tracks[0].attach();
			cache.className = "Testing";
			$("#speaker_target").append(cache); //Attach the track for preview
			$("#video_target").append(roomObj.tracks[1].attach());
		})

}
function cohost_accept(source){
    //get username from button's id to username
    let cohost_name = source.attr("id");
    console.log()
    $.post("/CoHostAccept?RoomName="+roomName+"&username="+cohost_name, function(data, status){

    });
}
function cohost_decline(source){
	//get username from button's id to username
	let cohost_name = source.attr("id");
	$.post("/CoHostDecline?RoomName="+roomName+"&username="+cohost_name, function(data, status){

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
	if(device_check[0] && device_check[1]){
		return Twilio.Video.createLocalTracks({audio: true, video: true}).then(function(localTracks){
			roomObj.tracks = localTracks;
			console.log(localTracks);
		});
	}

}
const room_join =async function(roomObj){ //Join the room with tracks
    // await GetTracks(roomObj); //Get local tracks from user, saved in roomObj.tracks
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
        //delete all entry in the list, then append the user list to the list
		$("#cohost_requests").empty()
        for(let i =0; i < data.length; i++){ //For each request, create with username, accept/decline button
			let row = $("<tr></tr>>")
			row.attr("id", i);
			let name_entry = $("<td>"+data[i].userName+"</td>");
			let accept_btn = $("<button class='acp_btn' id='"+data[i].userName+"'>Accept</button>");
			let decline_btn = $("<button class='dec_btn' id='"+data[i].userName+"'>decline</button>");
			accept_btn.click(function(){
				cohost_accept(accept_btn);
				accept_btn.parent().parent().remove(); //Delete the whole row after choice has made
			})
			decline_btn.click(function(){
				cohost_decline(decline_btn);
				decline_btn.parent().parent().remove();
			})
			row.append(name_entry);
			row.append($("<td></td>").append(accept_btn));
			row.append($("<td></td>").append(decline_btn));
			$("#cohost_requests").append(row);
        }
        return;
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

const video_token = async function(){ // Get video token if grant access
    //Backend: 1. Check if the user is allowed to stream
    //2. Check with host to see if they allow this user to stream
    return $.get("/EventAccessToken?RoomName="+roomName, function(data, status){
		roomObj.token = data;

	}); //Get the access token or reject if user is not authorised
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