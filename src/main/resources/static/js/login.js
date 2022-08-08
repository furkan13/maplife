let loginbox=document.getElementById("login-box")
let loginMsg=document.getElementById("login-msg")
let signupUsernameMsg=document.getElementById("signup-username")
let signupUsernameMsg2=document.getElementById("signup-username2")
let signupPasswordMsg=document.getElementById("signup-password")
let signupComfirmPasswordMsg=document.getElementById("signup-comfirmPassword2")
let loginUsername=null;
let loginPassword=null;
let signupUsername=null;
let signupPassword=null;
let signupConfirmPassword=null;
let signupEmail=null;
let headerButton = GetQueryString("button")
let tabLoginButton =document.getElementById("login-a")
let tabSignupButton =document.getElementById("signup-a")


window.onload = function (){
    document.getElementById("signupUsername").value="";
    document.getElementById("signupPassword").value="";
    document.getElementById("signupConfirmPassword").value="";
    document.getElementById("signupEmail").value="";
}
function GetQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg); // get the parameters behind ?
    let context = "";
    if (r != null)
        context = decodeURIComponent(r[2]);
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : context;
}
/*capture login user input
* verify user password, show wrong password message*/
const captureUserInput = function (e) {
    const userInput = e.target.value;
    const elementName = e.target.name;
    // const elementId = e.target.id

    if (elementName === "username") {
        loginUsername = userInput;
    } else if (elementName === "password") {
        loginPassword = userInput;
    }
}
//capture signup user input
const captureUserInputForS = function (e) {
    const userInputForS = e.target.value;
    const elementNameForS = e.target.name;
    if (elementNameForS === "username") {
        if (userInputForS !== null) {
            const validated = validate(elementNameForS, userInputForS);
            if (validated === true) {
                signupUsername = userInputForS;
            }
        }
        else {
            signupUsernameMsg2.style.display="none";
        }
    }
    else if (elementNameForS === "password") {
        signupPasswordMsg.style.display="none";
        const validated = validate(elementNameForS, userInputForS);
        if(validated){
            signupPassword = userInputForS;
        }
    }
    else if (elementNameForS === "confirmPassword") {
        const matching=matchPassword(signupPassword,userInputForS)
        if(matching){
            signupComfirmPasswordMsg.style.display="none";
            signupConfirmPassword = userInputForS;
        }
        else {
            signupConfirmPassword=null;
            signupComfirmPasswordMsg.style.display="block";
        }
    }
    else if (elementNameForS === "email") {
        const validated = validate(elementNameForS, userInputForS);
            signupEmail = userInputForS;
    }

};
const loginUser = async function (e) {
    e.preventDefault();
    if (loginUsername != null && loginPassword != null) {
        const userObject = {
            username: loginUsername,
            password: loginPassword,
        }

        const response = await fetch("/userLogin", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(userObject),
        });
        if (response.status == "200") {
            const data = await response.json();
            console.log(data);
            window.location.href="/"
        } else {
            loginMsg.style.display="block";
        }

    }
    else {
        loginMsg.style.display="block";
    }
}
// Function to validate the userInputs
const validate = function (elementNameForS, userInputForS) {
    let validated = false;
    if (elementNameForS === "password") {
        if (userInputForS.length > 7) {
            validated = true;
            signupPasswordMsg.style.display="none";
        } else {
            signupPasswordMsg.style.display="block";
        }
    }
    else if (elementNameForS === "username") {
        if (userInputForS.length < 20) {
            validated = true;
            signupUsernameMsg.style.display="none";
        } else {
            signupUsernameMsg.style.display="block";
        }
    }
    return validated;
};

const matchPassword = function (password, confirmPassword) {
    let matching = false;
    if (password === confirmPassword) {
        matching = true;
    }
    return matching;
};

const signupUser = async function (e) {
    e.preventDefault();
    if (signupUsername != null && signupPassword != null && signupConfirmPassword !=null && signupEmail != null) {
        const userObject = {
            username: signupUsername,
            password: signupPassword,
            email:signupEmail,
        }
        const response = await fetch("/addUser", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(userObject),
        })
        if (response.status == "200") {
            const data = await response.json();
            console.log(data);
            window.location.href="/"
        } else {
            signupComfirmPasswordMsg.style.display="none";
            signupUsernameMsg2.style.display="block";
        }
    }
    else{
        signupUsernameMsg.style.display="block";
        signupPasswordMsg.style.display="block";
        signupComfirmPasswordMsg.style.display="block";

    }
}


//show the login and signup box
const showLoginbox = function (){
    loginbox.style.display="block";
    if(headerButton==="login-button"){
        tabSignupButton.className="";
        tabLoginButton.className="current";
        document.getElementById("dom-login").style.display="block";
        document.getElementById("dom-signup").style.display="none";
    }
    else if(headerButton==="signup-button"){
        tabLoginButton.className="";
        tabSignupButton.className="current";
        document.getElementById("dom-login").style.display="none";
        document.getElementById("dom-signup").style.display="block";
    }
}
showLoginbox()
const loginTab = function (){
        tabSignupButton.className="";
        tabLoginButton.className="current";
        document.getElementById("dom-login").style.display="block";
        document.getElementById("dom-signup").style.display="none";
    }
const signupTab = function (){
        tabLoginButton.className="";
        tabSignupButton.className="current";
        document.getElementById("dom-login").style.display="none";
        document.getElementById("dom-signup").style.display="block";
    }

const usernameInput = document.getElementById("loginUsername");
const passwordInput = document.getElementById("loginPassword");
const loginButton = document.getElementById("loginBtn");
const usernameInputForS=document.getElementById("signupUsername");
const passwordInputForS=document.getElementById("signupPassword");
const confirmPasswordInputForS=document.getElementById("signupConfirmPassword");
const emailInputForS=document.getElementById("signupEmail");
const signupButton = document.getElementById("signupBtn");

usernameInput.addEventListener("change", captureUserInput);
passwordInput.addEventListener("change", captureUserInput);
loginButton.addEventListener("click", loginUser);
usernameInputForS.addEventListener("change", captureUserInputForS)
passwordInputForS.addEventListener("change", captureUserInputForS)
confirmPasswordInputForS.addEventListener("change", captureUserInputForS)
emailInputForS.addEventListener("change", captureUserInputForS)
signupButton.addEventListener("click", signupUser);
tabLoginButton.addEventListener("click", loginTab);
tabSignupButton.addEventListener("click",signupTab);
