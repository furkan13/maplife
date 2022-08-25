let tabProfileButton =document.getElementById("profileButton")
let tabPrivacyButton =document.getElementById("privacyButton")
let profileIcon=document.getElementById("profileIcon")
let inputChoose=document.getElementById("inputChoose")
let uploadIconButton=document.getElementById("uploadIconButton")
let introVideoInput=document.getElementById("introduction-video")
let bioTextInput=document.getElementById("bio-text")
let updateVideoButton=document.getElementById("updateVideoBtn")
let updateBioButton=document.getElementById("updateBioBtn")
let emailAddress=document.getElementById("emailAddress")
let oldEmailBox=document.getElementById("oldEmailBox")
let newEmailBox=document.getElementById("newEmailBox")
let changeEmailBtn=document.getElementById("changeEmailBtn")
let submitEmailBtn=document.getElementById("submitEmailBtn")
let emailInput=document.getElementById("newEmail")
let changePasswordBtn=document.getElementById("changePasswordBtn")
let changePasswordBox=document.getElementById("changePasswordBox")
let oldPasswordBox=document.getElementById("oldPasswordBox")
let verifiedPasswordBtn=document.getElementById("verifiedPasswordBtn")
let oldPasswordInput=document.getElementById("oldPassword")
let newPasswordBox=document.getElementById("newPasswordBox")
let submitPasswordBtn=document.getElementById("submitPasswordBtn")
let newPasswordInput=document.getElementById("newPassword")
let passwordMsg=document.getElementById("password-Msg")
let wrongPasswordMsg=document.getElementById("wrongPasswordMsg")
let invalidPasswordMsg=document.getElementById("invalidPasswordMsg")
let deleteUserBox=document.getElementById("deleteUserBox")
let deleteBtn=document.getElementById("deleteBtn")
let currentPasswordBox=document.getElementById("currentPasswordBox")
let confirmDeleteBtn=document.getElementById("confirmDeleteBtn")
let wrongPasswordMsg2=document.getElementById('wrongPasswordMsg2');
let currentPasswordInput=document.getElementById("currentPassword")

let introVideo=null;
let bioText=null;
let newEmail=null;
let oldPassword=null;
let newPassword=null;

const captureUserInput = function (e) {
    const userInput = e.target.value;
    const elementId = e.target.id;
    const elementName =  e.target.name;


    if (elementId === "introduction-video") {
        introVideo = userInput;
    } else if (elementId === "bio-text") {
        bioText = userInput;
    } else if (elementId === "newEmail"){
        newEmail=userInput;
    } else if (elementName === "password") {
        oldPassword = userInput;
    }
    else if (elementId === "newPassword") {
        const validated = validate(elementId, userInput);
        if (validated === true) {
            invalidPasswordMsg.style.display="none"
            newPassword = userInput;
        }
        else {
            invalidPasswordMsg.style.display="block"
        }
    }
}

const validate = function (elementId, userInput) {
    let validated = false;
    if (elementId === "newPassword") {
        if (userInput.length > 7) {
            validated = true;
        }
        return validated;
    }
}
const showUserInfo = async function (){
    let userJson = await getUser()
    profileIcon.setAttribute("src","image/"+userJson.icon)
    emailAddress.innerText=userJson.email
}
showUserInfo().then()

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
    reader.onload = function (e) {
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
        location.reload();
    }
}

function linkYT(introVideo) {
    let tmpUrl  = introVideo.replace('https:','')
    introVideo = tmpUrl.replace('watch?v=','embed/')+'?wmode=transparent'
    return introVideo
}
const updateVideo = async function () {
    introVideo=linkYT(introVideo)
    const userObject = {
        video: introVideo
    }
    const response = await fetch("/api/updateVideo", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(userObject),
    })
    if (response.status == "200"){
        introVideoInput.value=""
    }

}

const updateBio = async function () {
    const userObject = {
        bio: bioText,
    }
    const response = await fetch("/api/updateBio", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(userObject),
    })
    if (response.status == "200"){
        bioTextInput.value=""
    }

}
const updateEmail = async function () {
    const userObject = {
        email: newEmail,
    }
    const response = await fetch("/api/updateEmail", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(userObject),
    })
    if (response.status == "200"){
        newEmailBox.style.display="none"
        oldEmailBox.style.display="block"
        changeEmailBtn.style.display="block"
        submitEmailBtn.style.display="none"
        emailAddress.innerText="Successfully change your email!"
    }

}

function showEmailBox(){
    oldEmailBox.style.display="none"
    newEmailBox.style.display="block"
    changeEmailBtn.style.display="none"
    submitEmailBtn.style.display="block"
}
function showOldPasswordBox(){
    changePasswordBox.style.display="none"
    changePasswordBtn.style.display="none"
    oldPasswordBox.style.display="block"
    verifiedPasswordBtn.style.display="block"
}

function showCurrentPasswordBox(){
    currentPasswordBox.style.display="block"
    confirmDeleteBtn.style.display="block"
    deleteUserBox.style.display="none"
    deleteBtn.style.display="none"

}
const deleteAccount = async function () {
    const response = await fetch("/api/deleteAccount", {
        method: "POST",
    })
    return response
}
const verifiedPassword = async function () {
    const userObject = {
        password: oldPassword,
    }
    const response = await fetch("/api/verifiedPassword", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(userObject),
    })
    return response
}
const changePasswordVerification = async function(){
    verifiedPassword().then(response=>{
        if (response.status == "200"){
            newPasswordBox.style.display="block"
            submitPasswordBtn.style.display="block"
            oldPasswordBox.style.display="none"
            verifiedPasswordBtn.style.display="none"
            wrongPasswordMsg.style.display="none"
        }
        else {
            wrongPasswordMsg.style.display="block"
        }
    })
}
const deleteAccountVerification = async function(){
    verifiedPassword().then(response=>{
        if (response.status == "200"){
            deleteAccount().then()
            window.location.href='/'
        }
        else {
            wrongPasswordMsg2.style.display="block"
        }
    })
}



const updatePassword = async function () {
    if(newPassword!=null) {
        const userObject = {
            password: newPassword,
        }
        const response = await fetch("/api/updatePassword", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(userObject),
        })
        if (response.status == "200") {
            changePasswordBtn.style.display = "block"
            changePasswordBox.style.display = "block"
            newPasswordBox.style.display = "none"
            submitPasswordBtn.style.display = "none"
            passwordMsg.innerText = "Successfully change your password!"

        }
    }
    else
    {
        invalidPasswordMsg.style.display="block"
    }

}

uploadIconButton.addEventListener("click",getNewIcon)
inputChoose.addEventListener("change",changeUserIcon)
tabProfileButton.addEventListener("click",profileTab)
tabPrivacyButton.addEventListener("click",privacyTab)
introVideoInput.addEventListener("change",captureUserInput)
bioTextInput.addEventListener("change",captureUserInput)
updateVideoButton.addEventListener("click",updateVideo)
updateBioButton.addEventListener("click",updateBio)
changeEmailBtn.addEventListener("click",showEmailBox)
submitEmailBtn.addEventListener("click",updateEmail)
emailInput.addEventListener("change",captureUserInput)
changePasswordBtn.addEventListener("click",showOldPasswordBox)
verifiedPasswordBtn.addEventListener("click",changePasswordVerification)
oldPasswordInput.addEventListener("change",captureUserInput)
submitPasswordBtn.addEventListener("click",updatePassword)
newPasswordInput.addEventListener("change",captureUserInput)
deleteBtn.addEventListener("click",showCurrentPasswordBox)
currentPasswordInput.addEventListener("change",captureUserInput)
confirmDeleteBtn.addEventListener("click",deleteAccountVerification)