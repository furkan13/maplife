let loginbox=document.getElementById("loginbox-content")
let loginUsername=null;
let loginPassword=null;
let signupUsername=null;
let signupPassword=null;
let signupEmail=null;
let loginButtonInput=null;
let signupButtonInput=null;









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
const captureUserInputForN = function (e) {
    signupButtonInput = e.target.id
    loginButtonInput = e.target.id;
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

//click the login button show loginbox
let as=document.getElementsByClassName('loginbox-content-header')[0].getElementsByTagName('a');
let contents=document.getElementsByClassName("dom");
const showLoginbox = function (){
    if (loginButtonInput==="login-button" && signupButtonInput ==="login-button"){

        as[0].className="";
        as[1].className='current';

        contents[0].style.display="none";
        // 当前div可见
        contents[1].style.display='block';
        // switchTab()
    }
    else if(signupButtonInput === "signup-button" && loginButtonInput ==="signup-button"){
        // loginbox.style.display="block";
        as[1].className="";
        as[0].className="current";

        contents[1].style.display="none";
        // 当前div可见
        contents[0].style.display='block';
        // switchTab()
    }
    loginbox.style.display="block";
}
// const switchTab = function () {
    for (let i = 0; i < as.length; i++) {
        let a = as[i];
        a.id = i;
        // 设置每个a标签的onclick事件
        a.onclick = function () {
            // 清楚所有标签的css设置，隐藏dom标签
            for (let j = 0; j < as.length; j++) {
                as[j].className = "";
                contents[j].style.display = "none";
            }
            // 设置当前标签样式及当前标签下的所有dom标签可见
            this.className = 'current';
            // 当前div可见
            contents[this.id].style.display = 'block';
        }
    }
// }
//switch login or sign up panel



const usernameInput = document.getElementById("loginUsername");
const passwordInput = document.getElementById("loginPassword");
const loginButton = document.getElementById("loginBtn");
const usernameInputForS=document.getElementById("signupUsername");
const passwordInputForS=document.getElementById("signupPassword");
const emailInputForS=document.getElementById("signupEmail");
const signupButton = document.getElementById("signupBtn");
const headerLoginButton =document.getElementById("login-button")
const headerSignupButton =document.getElementById("signup-button")

usernameInput.addEventListener("change", captureUserInput);
passwordInput.addEventListener("change", captureUserInput);
loginButton.addEventListener("click", loginUser);
usernameInputForS.addEventListener("change", captureUserInputForS)
passwordInputForS.addEventListener("change", captureUserInputForS)
emailInputForS.addEventListener("change", captureUserInputForS)
signupButton.addEventListener("click", signupUser);
headerLoginButton.addEventListener("click", captureUserInputForN);
headerSignupButton.addEventListener("click",captureUserInputForN);