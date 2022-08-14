$("#Steam") //streaming window
//Query string: room name
//Cache: username hashed
// import { Player } from '@twilio/live-player-sdk';
const QueryString = new URLSearchParams(window.location.search);
const room = QueryString.get("room");
let player;
var user_name="Jeff";
//user_name should be local stroage/cookie which is obtained when logging in
function main(){
    let roomToken, liveToken ="";
//    $("#video_rm").click(user_check(roomToken));
    $("#create_room").click(room_create());
//    live_token(liveToken)
    if(liveToken != ""){
        init_player(player,liveToken);
        $("#Steam").appendChild(player.videoElement);
    }
    console.log(liveToken,roomToken);
}
const room_create = async function(e){
    const event_object= {
        event_title: "Jeff"
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
                        window.location.href="/"
                    }


//    $.post("/RoomCreation", event_object);
}
function user_check(token){ //Check for hashed user name for identity, Get video token if grant access
    //Backend: 1. Check if the user is allowed to stream
    //2. Check with host to see if they allow this user to stream
    token = $.get("/RoomAccess?user="+user_name+"&room="+room); //Get the access token or reject if user is not authorised
    if(token == ""){//Show user not enough coins
        $("#pop_up").innerHTML= "You are not allowed to stream in this room"
        $("#pop_up").show();
        return;
    }
    return token;
}

function live_token(token) { //Get live token for the room, required for all users
    token = $.get("/LiveAccess?room=" + room); //Get the access token
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
main();