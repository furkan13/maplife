let username=null;
let password=null;
//capture login user input
const captureUserInput = function (e) {
    const userInput = e.target.value;
    const elementName = e.target.name;

    if (elementName === "username") {
        username=userInput;
    } else if (elementName === "password") {
        password = userInput;
    }
};

const loginUser = async function (e) {
    e.preventDefault();
    if (username != null && password != null) {
        const userObject = {
            username: username,
            password: password,
        };
        const response = await fetch("/userLogin", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(userObject),
        });
    }
}

const usernameInput = document.getElementsByName("username");
const passwordInput = document.getElementsByName("password");

usernameInput.addEventListener("change", captureUserInput);
passwordInput.addEventListener("change", captureUserInput);