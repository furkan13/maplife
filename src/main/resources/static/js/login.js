let loginbox=document.getElementById("login-box")
let popupLayer=document.getElementById("popLayer")
let loginUsername=null;
let loginPassword=null;
let signupUsername=null;
let signupPassword=null;
let signupEmail=null;
let loginButtonInput=null;
let signupButtonInput=null;
let tabLoginButtonInput=null;
let tabSignupButtonInput=null;
let popupLayerInput=null;


//capture login user input
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
        })
        // window.location.href="/"
        loginbox.style.display="none"
    }
}


//capture signup user input
const captureUserInputForS = function (e) {
    const userInputForS = e.target.value;
    const elementNameForS = e.target.name;
    if (elementNameForS === "username") {
        signupUsername=userInputForS;
    } else if (elementNameForS === "password") {
        signupPassword = userInputForS;
    }else if (elementNameForS === "email") {
        signupEmail = userInputForS;
    }
};

const signupUser = async function (e) {
    e.preventDefault();
    if (signupUsername != null && signupPassword != null && signupEmail != null) {
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
        // window.location.href="/"
        loginbox.style.display="none"
    }
}


//show the login and signup box
const showLoginbox = function (e){
    signupButtonInput = e.target.id;
    loginButtonInput = e.target.id;
    tabLoginButtonInput = e.target.id
    tabSignupButtonInput = e.target.id;
    loginbox.style.display="block";
    popupLayer.style.display="block";
    if(loginButtonInput==="login-button" || tabLoginButtonInput==="login-a"){
        document.getElementById("signup-a").className="";
        document.getElementById("login-a").className="current";
        document.getElementById("dom-login").style.display="block";
        document.getElementById("dom-signup").style.display="none";
    }
    else if(signupButtonInput==="signup-button" || tabSignupButtonInput==="signup-a"){
        document.getElementById("login-a").className="";
        document.getElementById("signup-a").className="current";
        document.getElementById("dom-login").style.display="none";
        document.getElementById("dom-signup").style.display="block";
    }
}
//click popupLayer to close the loginBox
const closeLoginBox =function(e){
    popupLayerInput = e.target.id;
    if(popupLayerInput==="popLayer"){
        loginbox.style.display="none";
    }
}






const usernameInput = document.getElementById("loginUsername");
const passwordInput = document.getElementById("loginPassword");
const loginButton = document.getElementById("loginBtn");
const usernameInputForS=document.getElementById("signupUsername");
const passwordInputForS=document.getElementById("signupPassword");
const emailInputForS=document.getElementById("signupEmail");
const signupButton = document.getElementById("signupBtn");
const headerLoginButton =document.getElementById("login-button")
const headerSignupButton =document.getElementById("signup-button")
const tabLoginButton =document.getElementById("login-a")
const tabSignupButton =document.getElementById("signup-a")
const layer=document.getElementById("popLayer")

usernameInput.addEventListener("change", captureUserInput);
passwordInput.addEventListener("change", captureUserInput);
loginButton.addEventListener("click", loginUser);
usernameInputForS.addEventListener("change", captureUserInputForS)
passwordInputForS.addEventListener("change", captureUserInputForS)
emailInputForS.addEventListener("change", captureUserInputForS)
signupButton.addEventListener("click", signupUser);
headerLoginButton.addEventListener("click", showLoginbox);
headerSignupButton.addEventListener("click",showLoginbox);
tabLoginButton.addEventListener("click", showLoginbox);
tabSignupButton.addEventListener("click",showLoginbox);
layer.addEventListener("click",closeLoginBox);