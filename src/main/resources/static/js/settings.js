let tabProfileButton =document.getElementById("profileButton")
let tabPrivacyButton =document.getElementById("privacyButton")
let profileIcon=document.getElementById("profileIcon")
let inputChoose=document.getElementById("inputChoose")
let uploadIconButton=document.getElementById("uploadIconButton")

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

 function changeUserIcon() {
    let fileData = inputChoose.files[0]
    var reader = new FileReader();
    reader.readAsDataURL(fileData);
    /*当读取操作成功完成时调用*/
    reader.onload = function (e) {
        // console.log(e);
        // console.log(this.result);
        // console.log(fileData.name)
        profileIcon.setAttribute("src", this.result)

    }
}

async function getNewIcon() {
    let fileData = inputChoose.files[0]
    const formObject = new FormData();
    formObject.append("image", fileData);

    const response = await fetch("api/uploadImage", {
        method: "POST",
        headers: {
            Accept: "application/json",
        },
        body: formObject
    });
    if (response.status == "200") {
        profileIcon.setAttribute("src","image/"+fileData.name)
        // profileIcon.setAttribute("src", fileData.name)
        location.reload();
    }


}

uploadIconButton.addEventListener("click",getNewIcon)
inputChoose.addEventListener("change",changeUserIcon)
tabProfileButton.addEventListener("click",profileTab)
tabPrivacyButton.addEventListener("click",privacyTab)