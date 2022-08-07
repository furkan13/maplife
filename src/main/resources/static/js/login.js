let loginbox=document.getElementById("login-box")
let popupLayer=document.getElementById("popLayer")
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
let loginButtonInput=null;
let signupButtonInput=null;
let tabLoginButtonInput=null;
let tabSignupButtonInput=null;



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
        signupUsernameMsg2.style.display="none";
        const validated = validate(elementNameForS, userInputForS);
        if(validated){
            signupUsername=userInputForS;
        }
    }
    if (elementNameForS === "password") {
        const validated = validate(elementNameForS, userInputForS);
        if(validated){
            signupPassword = userInputForS;
        }
    }
    if (elementNameForS === "confirmPassword") {
        // const validated = validate(elementNameForS, userInputForS);
        const matching=matchPassword(signupPassword,userInputForS)
        // signupConfirmPassword = userInputForS;
        if(matching){
            signupComfirmPasswordMsg.style.display="none";
            signupConfirmPassword = userInputForS;
        }
        else {
            // signupConfirmPassword = null;
            signupConfirmPassword=null;
            signupComfirmPasswordMsg.style.display="block";
        }

        // signupEmail = userInputForS;
    }
    if (elementNameForS === "email") {
        const validated = validate(elementNameForS, userInputForS);
        // if(validated){
            signupEmail = userInputForS;
        // }
        // signupEmail = userInputForS;
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
            loginbox.style.display = "none"
        } else {
            loginMsg.style.display="block";
        }

    }
}
// Function to validate the userInputs
const validate = function (elementNameForS, userInputForS) {
    let validated = false;
    if (elementNameForS === "username") {
        if (userInputForS.length < 20) {
            validated = true;
            signupUsernameMsg.style.display="none";
        } else {
            signupUsernameMsg.style.display="block";
        }

    }
    if (elementNameForS === "password") {
        if (userInputForS.length > 7) {
            validated = true;
            signupPasswordMsg.style.display="none";
        } else {
            signupPasswordMsg.style.display="block";
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
            loginbox.style.display="none";
        } else {
            signupComfirmPasswordMsg.style.display="none";
            signupUsernameMsg2.style.display="block";
        }
        // window.location.href="/"

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
        loginbox.style.display="none";
        loginMsg.style.display="none";
}






const usernameInput = document.getElementById("loginUsername");
const passwordInput = document.getElementById("loginPassword");
const loginButton = document.getElementById("loginBtn");
const usernameInputForS=document.getElementById("signupUsername");
const passwordInputForS=document.getElementById("signupPassword");
const confirmPasswordInputForS=document.getElementById("signupConfirmPassword");
const emailInputForS=document.getElementById("signupEmail");
const signupButton = document.getElementById("signupBtn");
const headerLoginButton =document.getElementById("login-button")
const headerSignupButton =document.getElementById("signup-button")
const tabLoginButton =document.getElementById("login-a")
const tabSignupButton =document.getElementById("signup-a")


usernameInput.addEventListener("change", captureUserInput);
passwordInput.addEventListener("change", captureUserInput);
loginButton.addEventListener("click", loginUser);
usernameInputForS.addEventListener("change", captureUserInputForS)
passwordInputForS.addEventListener("change", captureUserInputForS)
confirmPasswordInputForS.addEventListener("change", captureUserInputForS)
emailInputForS.addEventListener("change", captureUserInputForS)
signupButton.addEventListener("click", signupUser);
headerLoginButton.addEventListener("click", showLoginbox);
headerSignupButton.addEventListener("click",showLoginbox);
tabLoginButton.addEventListener("click", showLoginbox);
tabSignupButton.addEventListener("click",showLoginbox);
