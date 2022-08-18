let tabProfileButton =document.getElementById("profileButton")
let tabPrivacyButton =document.getElementById("privacyButton")
let profileIcon=document.getElementById("profileIcon")

const showProfileUserIcon = async function (){
    let userJson = await getUser()
    profileIcon.setAttribute("src","image/"+userJson.icon)
}
showProfileUserIcon().then()

const profileTab = function (){
    tabPrivacyButton.className="nav-item";
    tabProfileButton.className="current";
    document.getElementById("settings-profile").style.display="block";
    document.getElementById("settings-privacy").style.display="none";
}
const privacyTab = function (){
    tabProfileButton.className="nav-item";
    tabPrivacyButton.className="current";
    document.getElementById("settings-profile").style.display="none";
    document.getElementById("settings-privacy").style.display="block";
}



tabProfileButton.addEventListener("click",profileTab)
tabPrivacyButton.addEventListener("click",privacyTab)