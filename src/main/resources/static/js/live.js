const QueryString = new URLSearchParams(window.location.search);
const room = QueryString.get("room");
let roomName = "TestingRoom";
if(room != null){
    roomName = room;
}
let roomObj = {room:"", tracks:[], token:"",VideoRoom:""};
let follow_list;
let processed_follow_list = {};
let count = 0;

const main = async function(){
	$("#exit_room").click(function(){//Check the identity of user, then provide different function and innerhtml
		room_exit(roomObj);
	});
	$("#partycheck").click(function(){ participant_video(roomObj);});
	await video_room();
	follow_list = await following_list();
	if(roomObj.VideoRoom["title"] == null){ //Server doesn't have the event entry of this roomname
		alert("Room name: "+roomName +" may be closed or not exist.\n Return to main page.");
		window.location.href = '../'; //Go back to main page
	}
	if(!roomObj.VideoRoom["live"]){ //If the room is not live, it must be a future event as server only provide valid event
		alert("This is a future event and the host has not launched it yet. Please wait until the host start the event.")
		window.location.href = '../'; //Go back to live page
	}
	await live_token();
	room_join(roomObj);
}
function following_list(){ //Ongoing test!!!
	return $.get("/api/GetfollowingUser", function(data,status){
		follow_list = data;
		for(int i =0; i< data.length; i++){
			processed_follow_list[data[i].userName] = i; //dictionary direct to follow_list
		}
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
	alert("Return to main page");
	window.location.href="/";
}
const room_join = async function(roomObj){

	//Connect without any track as they are viewers
    await Twilio.Video.connect(roomObj.token, {name: roomName, tracks:[]}).then(room => {
        console.log(`Successfully joined a Room: ${room}`);
        roomObj.room = room;
		room.on("participantDisconnected", participant=>{
			if($("#"+participant.identity).length > 0){
				$("#"+participant.identity).remove();
			}
		});
		room.on("disconnected", room=>{
			alert("The room is closed now. Return to main page");
			window.location.href="/";
			
			
		});
        // room.on('participantConnected', participant => {
            // console.log(`A remote Participant connect ed: ${participant}`);

		// });
	}, error => {
		console.error(`Unable to connect to Room: ${error.message}`);
	});
	update_tracks();
	participant_video(roomObj); //Get existing user's video
	participant_video_on_connect(roomObj); //Get user's video when they connect
	
}
function update_tracks(){
	$.get("/UpdateTracks?RoomName="+roomName, function(data,status){
		
	});
}
function video_room(){ //Get event detail from server
	return $.get("/EventDetail?RoomName="+roomName, function(data,status){
		roomObj.VideoRoom = data;
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
const live_token = async function(){ // Get video token if grant access
    //Backend: 1. Check if the user is allowed to stream
    //2. Check with host to see if they allow this user to stream
    return $.get("/LiveAccessToken?RoomName="+roomName, function(data, status){
		roomObj.token = data;
	}); //Get the access token or reject if user is not authorised
}
const create_main_audio = async function(participant){ //!!!Add host name and link to profile, sub button
	
	let localAudio = "";
	await participant.audioTracks.forEach((tracks)=>{localAudio = tracks.track.attach()}); //Need to debug
	localAudio.id = "main_audio"; //added id to control with volume slider
	localAudio.volume = 0;
	// Volume control and mute button 
	// slider
	//Only mute when user is host!!!
	let volume_slider = $("<input></input>");
	volume_slider.attr("type", "range");

	
	
	volume_slider.attr("min", 0);
	volume_slider.attr("max", 100);
	volume_slider.attr("step", 1);
	volume_slider.change(function(){volume_adjust(volume_slider)});
	//mute 
	let volume_mute_btn = $("<button></button>");
	
	volume_mute_btn.html("mute");//!!!Should implement mute icon
	
	volume_mute_btn.click(function(){volume_mute(volume_mute_btn,volume_slider)});
	volume_slider.attr("value", 100); //default unmuted
	volume_slider.data("volume", 0);//storing the restoring volume as id
	localAudio.volume = 1;
	localAudio.muted = false;
	
	let audio_related = $("<div></div>");
	audio_related.attr("id", "stream_audio");
	audio_related.data("userid", participant.sid);
	audio_related.data("username", participant.identity);
	audio_related.append(localAudio);
	audio_related.append(volume_slider);
	audio_related.append(volume_mute_btn);
	
	return audio_related;
}
function create_cohost_function(participant){ //!!!Add cohost name and link to profile, sub button
	
	//red cross button for not showing/kick
	//Host: kicking the user
	//cohost: hide the video 
	let hide_kick_btn = $("<button></button>");
	hide_kick_btn.html("hide");//!!!Should implement red cross icon
	hide_kick_btn.data("username", participant.identity);
	hide_kick_btn.data("userid", participant.sid);
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
function sub_related(source){//follow or unfollow the 
	userObject = {
		username: source.data("username")
	}
	if(sub_btn.data("sub"){//if button is true: that user is followed, unfollowing that user
		$.ajax({
			url: "/api/unFollowUser",
			type: "PUT",
			contentType: "application/json",
			data:JSON.stringify(userObject)
		})
		source.html("Follow");
		sub_btn.data("sub", false);
	}
	else{ //Following that user
		$.ajax({
			url: "/api/FollowUser",
			type: "PUT",
			contentType: "application/json",
			data:JSON.stringify(userObject)
		})
		source.html("Followed");
		sub_btn.data("sub", true);
	}
}
function getUser(username){
	
}
function userBlockBuild(username){ //Build the div(icon,username and follow btn) for each user
	//Append link to user's profile and subscribe button 
	let user_div = $("<div></div>");
	//Obtain user's User object by calling api (get user by username)
	host_user = await getUser(username);
	//Add user icon in the div
	let icon_wrap = $("<div></div>");
	icon_wrap.attr("class","profile-user-icon");
	let icon = $("<img></img>");
	icon.attr("class","profile-user-image");
	icon.attr("src", "/image/"+host_user.icon);
	icon_wrap.append(icon);
	let user_link = $("<a>"+ username+"</a>");
	user_link.attr("href", "/profile/"+username);
	let sub_btn_wrap = $("<div></div>");
	sub_btn_wrap.attr("class", "editBtn");
	let sub_btn = $("<input></input>");
	sub_btn.attr("id", "followBtn");
	sub_btn.data("username", username);
	sub_btn.data("sub", false);//Default not follow
	sub_btn.html("Follow");
	sub_btn.attr("class", "btn btn-sm btn-outline-secondary");
	sub_btn.attr("type", "button");
	//Check if user is followed
	if(processed_follow_list[username]){//processed_follow_list: dictionary
		sub_btn.html("Followed");
		sub_btn.data("sub", true);//followed
	}
	sub_btn.click(function(){sub_related(sub_btn)});
	sub_btn_wrap.append(sub_btn);
	
	user_div.append(user_link);
	user_div.append(icon_wrap);
	user_div.append(sub_btn_wrap);
	
	return user_div;
}
const participant_video_on_connect = async function(roomObj){ //function for on connect 
	roomObj.room.on('participantConnected', participant => {
	  
		//Only attach video tracks, attach audio when user click the window, allow delete if host
		participant.tracks.forEach((publication) => {
			if(publication.isSubscribed){
				video_window = $("<div></div>");//Div for video
				video_window.attr("id", participant.identity);
				let video_cache =  publication.track;//Add video in the div
				video_window.append(video_cache.attach());
				//Need to subscribe the video before posting it on panel!!!
				video_window.append(userBlockBuild(participant.identity));
				
				
				//Attaching it to user interface
				if(participant.identity == roomObj.VideoRoom.user.username){ 
					//Shown in main stream as that is host 
					if(participant.audioTracks){
						let audio_related = create_main_audio(participant);
						audio_related.then((reply)=>{video_window.append(reply);})
						
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
				video_window.append(userBlockBuild(participant.identity));
				
				//Attaching it to user interface
				if(participant.identity == roomObj.VideoRoom.user.username){ 
					//Shown in main stream as that is host 
					if(participant.audioTracks){
						let audio_related = create_main_audio(participant);
						audio_related.then((reply)=>{video_window.append(reply);})
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
	//Looping for all other user in the video room
	roomObj.room.participants.forEach((participant) => { 
		//Only attach video tracks, attach audio when user click the window, allow delete if host
		participant.tracks.forEach((publication) => {
			if(publication.track != null){
				if(publication.track.kind =="video"){ //
					console.log("onconnect tracks");
					console.log(publication.track);
					video_window = $("<div></div>");//Div for video
					video_window.attr("id", participant.identity);
					let video_cache =  publication.track;//Add video in the div
					video_window.append(video_cache.attach());
					//Need to subscribe the video before posting it on panel!!!
					video_window.append(userBlockBuild(participant.identity));

					//Attaching it to user interface
					if(participant.identity == roomObj.VideoRoom.user.username){
						//Shown in main stream as that is host
						if(participant.audioTracks){
							let audio_related = create_main_audio(participant);
							audio_related.then((reply)=>{video_window.append(reply);})
						}
						$("#stream").append(video_window);
					}
					else{ //Other cohost
						let cache = create_cohost_function(participant);
						video_window.append(cache);
						$("#bottom_other_stream").append(video_window);;
					}
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
				video_window.append(userBlockBuild(participant.identity));
				
				//Attaching it to user interface
				if(participant.identity == roomObj.VideoRoom.user.username){ 
					//Shown in main stream as that is host 
					if(participant.audioTracks){
						let audio_related = create_main_audio(participant);
						audio_related.then((reply)=>{video_window.append(reply);})
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
$(document).ready(function(){
	main();
});