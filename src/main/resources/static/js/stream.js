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
let roomObj = {room:"", tracks:[], token:"",VideoRoom:""};
let local_track = [[[],[],[]],[[],[],[]]];//[n][0]:Video,[n][1]:Speaker,[n][2]:Mic, n=0: id, n=1: tag
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
	if(userJson.userId == roomObj.VideoRoom["user"].id){ //If the user is the host of this room
		//Build the host page accordingly
		//Show submit button and add event listener
		await video_token(); //Get token before letting host to join the room
		$("#join_room_btn").click(function(){
			blackscreen.hide();
			$("#speaker_target").empty();
			$("#video_target").empty();
			host_join();
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
		
		if(!roomObj.VideoRoom["live"]){ //If the room is not live, it must be a future event as server only provide valid event
			alert("This is a future event and the host has not launched it yet. Please wait until the host start the event.")
			window.location.href = '../'; //Go back to live page
		}
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
		if(roomObj.token ==""){
			cohost_send(); //Send a cohost request if user cannot get the token
		}
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
const host_join = async function(){
	await room_final_check(); //Create a twilio room if future event
	await video_room(); //Get the room detail again
	room_join(roomObj);
}
function sleep(ms){
	return new Promise(resolve => setTimeout(resolve,ms));
}
function switch_video(target, listvideo){ //User changing video source, input: target of the video, select list
	roomObj.tracks[1].stop();//Stop current video stream
	// console.log(listvideo.val());
	if(listvideo.val() == "screen"){ //If user selected for screen sharing
		navigator.mediaDevices.getDisplayMedia().then((streams) => {
			let Screen_video = new Twilio.Video.LocalVideoTrack(streams.getTracks()[0]);
			roomObj.tracks[1] = Screen_video;
			target.empty();//Clear the previous track in show
			target.append(Screen_video.attach());

		});
		return;
	}
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
	
	navigator.mediaDevices.getUserMedia({ audio: false, video: true })
	.then(s=>{
		stream = s;
		if (!navigator.mediaDevices?.enumerateDevices) {
		console.log("enumerateDevices() not supported.");
		} 
		else {
			navigator.mediaDevices.enumerateDevices()
			.then((devices) => {
				devices.forEach((device) => {
					// console.log(device.label);
					if(device.kind == "videoinput"){
						local_track[0][0].push(device.deviceId);
						local_track[1][0].push(device.label);
					}
				});
				local_track[0][0].push("screen");
				local_track[1][0].push("Screen capture");
			})


		}
	})
	.catch(err =>{ //If user do not have any camera
		local_track[0][0].push("screen");
		local_track[1][0].push("Screen capture");
	});

	return navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(s=>{
		stream = s;
		if (!navigator.mediaDevices?.enumerateDevices) {
			console.log("enumerateDevices() not supported.");
		} else {
			return navigator.mediaDevices.enumerateDevices()
			.then((devices) => {
				devices.forEach((device) => {
					// console.log(device.label);
					// if(device.kind == "videoinput"){
						// local_track[0][0].push(device.deviceId);
						// local_track[1][0].push(device.label);
					// }
					if(device.kind == "audiooutput"){
						local_track[0][1].push(device.deviceId);
						local_track[1][1].push(device.label);
					}
					if(device.kind == "audioinput"){
						local_track[0][2].push(device.deviceId);
						local_track[1][2].push(device.label);
					}
					
				});
				// local_track[0][0].push("screen");
				// local_track[1][0].push("Screen capture");
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
	$("#video_target").empty();//Clear the previous track in show
	if(local_track[0][0][0] == "screen"){ //If user do not have any camera, set camera as screen capture
		navigator.mediaDevices.getDisplayMedia().then((streams) => {
			let Screen_video = new Twilio.Video.LocalVideoTrack(streams.getTracks()[0]);
			roomObj.tracks[1] = Screen_video;

			$("#video_target").append(roomObj.tracks[1].attach());
		});
	}
	else{
		Twilio.Video.createLocalTracks({audio:false, video:{deviceId:{exact:local_track[0][0][0]}}})
			.then((stream)=> {
				roomObj.tracks[1] = stream[0]; //Store the tracks in roomObj
				$("#video_target").append(roomObj.tracks[1].attach());
			})
		
	}
	
	
	Twilio.Video.createLocalTracks({audio:{deviceId:{exact:local_track[0][2][0]}}, video:false})
		.then((stream)=> {
			roomObj.tracks[0] = stream[0]; //Store the tracks in roomObj
			
			$(".Testing").remove();

			//Make an id for the audio, so doesn't delete all
			let cache = roomObj.tracks[0].attach();
			cache.className = "Testing";
			$("#speaker_target").append(cache); //Attach the track for preview
			
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
function room_final_check(){

	return $.post("/HostJoin?RoomName="+roomName, function(data, status){

	});
}


function create_main_audio(participant){
	
	let localAudio = "";
	participant.audioTracks.forEach((tracks)=>{localAudio = tracks.track.attach()}); //Need to debug
	localAudio.id = "main_audio"; //added id to control with volume slider
	localAudio.volume = 0;
	// Volume control and mute button 
	// slider
	let volume_slider = $("<input></input>");
	volume_slider.attr("type", "range");
	volume_slider.attr("value", 0); //default muted
	volume_slider.data("volume", 1);//storing the restoring volume as id
	volume_slider.attr("min", 0);
	volume_slider.attr("max", 100);
	volume_slider.attr("step", 1);
	volume_slider.change(function(){volume_adjust(volume_slider)});
	//mute 
	let volume_mute_btn = $("<button></button>");
	
	volume_mute_btn.html("mute");//!!!Should implement mute icon
	
	volume_mute_btn.click(function(){volume_mute(volume_mute_btn,volume_slider)});
	
	let audio_related = $("<div></div>");
	audio_related.attr("id", "stream_audio");
	audio_related.data("userid", participant.sid);
	audio_related.data("username", participant.identity);
	audio_related.append(localAudio);
	audio_related.append(volume_slider);
	audio_related.append(volume_mute_btn);
	
	return audio_related;
}
function create_cohost_function(participant){
	
	//red cross button for not showing/kick
	//Host: kicking the user
	//cohost: hide the video 
	let hide_kick_btn = $("<button></button>");
	hide_kick_btn.html("hide");//!!!Should implement red cross icon
	hide_kick_btn.data("username", participant.identity);
	hide_kick_btn.click(function(){hide_kick(hide_kick_btn)});
	//Clickable div, call switching function if click
	//Create a div overlay to ease deleting it 
	let cache = $("<div></div>");
	cache.data("username", participant.identity);
	cache.data("userid", participant.sid);
	// cache.click(function(){stream_switch(cache)});
	cache.append(hide_kick_btn);
	
	return cache;
}
function participant_video_on_connect(roomObj){ //function for on connect 
	roomObj.room.on('participantConnected', participant => {
	  
		//Only attach video tracks, attach audio when user click the window, allow delete if host
		participant.tracks.forEach((publication) => {
			if(publication.isSubscribed){
				video_window = $("<div></div>");//Div for video
				video_window.attr("id", participant.identity);
				let video_cache =  publication.track;//Add video in the div
				video_window.append(video_cache.attach());
				//Need to subscribe the video before posting it on panel!!!
				
				
				//Attaching it to user interface
				if(participant.identity == roomObj.VideoRoom.user.username){ 
					//Shown in main stream as that is host 
					if(participant.audioTracks){
						let audio_related = create_main_audio(participant);
						video_window.append(audio_related);
					}
					$("#stream").append(video_window);
				}
				else{ //Other cohost 
					let cache = create_cohost_function(participant);
					video_window.append(cache);
					$("#bottom_other_stream").append(video_window);;
				}
			}
		});

        participant.on("trackSubscribed",track =>{
			
			if(track.kind == "video"){
				console.log("onsub tracks");
				console.log(track);
				video_window = $("<div></div>");//Div for video
				video_window.attr("id", participant.identity);
				video_window.append(track.attach());//Add video in the div
				//Need to subscribe the video before posting it on panel!!!
				
				
				//Attaching it to user interface
				if(participant.identity == roomObj.VideoRoom.user.username){ 
					//Shown in main stream as that is host 
					if(participant.audioTracks){
						let audio_related = create_main_audio(participant);
						video_window.append(audio_related);
					}
					$("#stream").append(video_window);
				}
				else{ //Other cohost 
					let cache = create_cohost_function(participant);
					video_window.append(cache);
					$("#bottom_other_stream").append(video_window);;
				}
			}
            
        });

	});
}
const participant_video = async function(roomObj){ //Show all the video of participant in the room, call when join the room
    //Empty the existing video
	$("#bottom_other_stream").empty();
	$("#stream").empty();
	
	
	//Main display: attach video and audio tracks, allow to mute volume 
	//Create whole object here, then append to stream div
	let video_window = $("<div></div>");//Div for video; //Storage for each video element;
	video_window.attr("id", userJson.username);
	// Host show their video as main as default
	roomObj.room.localParticipant.tracks.forEach(publication => { 

		if(publication.kind == "video"){ //video element, add audio control on it
			video_window.append(publication.track.attach());
			
		}
		if(publication.kind == "audio"){ //Audio element, put in different container
			// Should mute in default to prevent echo
			
			let audio_related = create_main_audio(roomObj.room.localParticipant);
			video_window.append(audio_related);
		}
	});
	//Localtrack appending
	//If host: append in main panel, if cohost: append in bottom stream
	
	if(roomObj.VideoRoom.user.id == userJson.userId ){ 
		$("#stream").append(video_window);
	}
	else{
		$("#stream_audio").remove();//remove the audio from local user
		let cache = create_cohost_function(roomObj.room.localParticipant);
		video_window.append(cache);
		$("#bottom_other_stream").append(video_window);
	}
	
	
	//Looping for all other user in the video room
	roomObj.room.participants.forEach((participant) => { 
		
		
		//Only attach video tracks, attach audio when user click the window, allow delete if host
		participant.tracks.forEach((publication) => {
			if(publication.track){
				console.log("onconnect tracks");
				console.log(publication.track);
				video_window = $("<div></div>");//Div for video
				video_window.attr("id", participant.identity);
				let video_cache =  publication.track;//Add video in the div
				video_window.append(video_cache.attach());
				//Need to subscribe the video before posting it on panel!!!
				
				
				//Attaching it to user interface
				if(participant.identity == roomObj.VideoRoom.user.username){ 
					//Shown in main stream as that is host 
					if(participant.audioTracks){
						let audio_related = create_main_audio(participant);
						video_window.append(audio_related);
					}
					$("#stream").append(video_window);
				}
				else{ //Other cohost 
					let cache = create_cohost_function(participant);
					video_window.append(cache);
					$("#bottom_other_stream").append(video_window);;
				}
			}
		});

        participant.on("trackSubscribed",track =>{
			
			if(track.kind == "video"){
				console.log("onsub tracks");
				console.log(track);
				video_window = $("<div></div>");//Div for video
				video_window.attr("id", participant.identity);
				video_window.append(track.attach());//Add video in the div
				//Need to subscribe the video before posting it on panel!!!
				
				
				//Attaching it to user interface
				if(participant.identity == roomObj.VideoRoom.user.username){ 
					//Shown in main stream as that is host 
					if(participant.audioTracks){
						let audio_related = create_main_audio(participant);
						video_window.append(audio_related);
					}
					$("#stream").append(video_window);
				}
				else{ //Other cohost 
					let cache = create_cohost_function(participant);
					video_window.append(cache);
					$("#bottom_other_stream").append(video_window);;
				}
			}
            
        });
    });
}

function stream_switch(source){//Swap the source to main stream panel
	//Remove stream audio first, add swap and remove functionality after swap 
	//host allow promote after switch
	let main_display = $("#stream_audio").parent(); //Switch to buttom_other_stream
	let side_display = source.parent().parent(); //Switch to main stream

	let main_id = $("#stream_audio").data("userid"); //Get twilio participant sid to retrieve the audio track
	let main_name = $("#stream_audio").data("username");
	let source_id = source.data("userid"); //Get twilio participant sid to retrieve the audio track
	let source_name = source.data("username");
	console.log(main_id);
	console.log(main_name);
	console.log(source_id);
	console.log(source_name);
	//Remove audio control in main and sup function in other
	$("#stream_audio").remove();
	source.remove();
	let audio_track = "";
	
	//Get the audio track from clicked user
	//Identifying whether it is a local user: if so: get it from local participant, else: get it fomr participant
	if(source_name == userJson.username){ //if the selected user is local participant
		if(roomObj.room.localParticipant.audioTracks){
			audio_track = create_main_audio(roomObj.room.localParticipant);
		}
		
	}
	else{
		//Bugs here!!!
		if(roomObj.room.participants.get(source_id).audioTracks){//the selected user is remoted
			audio_track = create_main_audio(roomObj.room.participants.get(source_id));
		}
		
	}
	side_display.append(audio_track);
	
	//Get swap function for the new side display
	let cache = "";
	if(main_name == userJson.username){ //if the current displaying main window is self
		cache = create_cohost_function(roomObj.room.localParticipant);
		
	}
	else{
		cache = create_cohost_function(roomObj.room.participants.get(main_id));
	}
	main_display.append(cache);
	
	let clone_main = main_display.clone();
	let clone_side = side_display.clone();
	
	main_display.replaceWith(clone_side);
	side_display.replaceWith(clone_main);
}
//Kick function completed
function hide_kick(source){//host: expand to ask confirm kicking, cohost: ask confirm hiding
	//Confirm dialog popup
	let reply = "hiding";
	if(roomObj.VideoRoom.user.id == userJson.userId){ //host
		reply = "kicking"
	}
	//Create a chat with title and inner span
	let cache = source.parent()
	cache.attr("title", "Confirm "+reply+"?");
	let target_username  = source.data("username");
	// source.append(cache);
	//
	
    cache.dialog({ //Target to the chat
		resizable: false,
		height: "100px", //Should be size of the window
		width: "100px",
		modal: false,
		buttons: {
			"Confirm": function() {
				
				
				if(roomObj.VideoRoom.user.id == userJson.userId){//host
					//Kick the target user in twilio room
					console.log(target_username);
					$.post("/CoHostKick?RoomName="+roomObj.VideoRoom["title"]+"&username="+target_username, function(data, status){});

				}
				//Hide the video
				$("#"+target_username).remove(); //Remove the whole video div(video_window)
				$( this ).dialog( "close" );
				
			},
			Cancel: function() {
				$( this ).dialog( "close" );
			}
		  }
		});
	
	
}
//Checking with volume_adjust & volume_mute finished
function volume_adjust(source){ //Only change input volume, twilio does not allow output volume setting
	if(parseInt(source[0].value) >0){
		$("#main_audio")[0].muted = false;
	}
	source.data("volume", 0);
	$("#main_audio")[0].volume = parseFloat(source[0].value/100);
}
function volume_mute(btn,slider){ //Mute function 
	if(slider.data("volume") == 0){ //Mute, data("volume") will only be 0 if audio is playing
		slider[0].value = 0;//Move the slider to 0
		slider.data("volume",$("#main_audio")[0].volume);//Set the restoring volume 
		$("#main_audio")[0].volume = 0; 
	}
	else{ //unmute
		$("#main_audio")[0].muted = false;
		$("#main_audio")[0].volume = slider.data("volume"); //Remove a in id and convert to nubmer
		slider[0].value = slider.data("volume")*100; //Move the slider back to original 
		slider.data("volume", 0);
	}
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
		room.on("participantDisconnected", participant=>{
			$("#"+participant.identity).remove();
			
		});
		room.on("disconnected", room=>{
			alert("The room is closed now. Return to main page");
			window.location.href="/";
			
			
		});
        // room.on('participantConnected', participant => {
            // console.log(`A remote Participant connected: ${participant}`);

		// });
	}, error => {
		console.error(`Unable to connect to Room: ${error.message}`);
	});
	participant_video(roomObj);
	participant_video_on_connect(roomObj);
}

function fetchCoHostRequest(){
    let interval = 15000; //5 second per request
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