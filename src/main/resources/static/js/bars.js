let userJsonIcon = null
let userJson = {}
let userJsonName = null
let userJsonEmail = null
const headerButtonLogged=document.getElementById("header-button").getElementsByTagName("ul")[1]
const userIcon = document.getElementById("user-icon-img-current")
const headerButton=document.getElementById("header-button").getElementsByTagName("ul")[0]
const dropDownBox=document.getElementById("dropdown")


const getUser = async function () {
        const response = await fetch("/api/getUser")
        if (response.status == "200") {
            // headerButton.style.display="none"
            const data = await response.json();
            console.log(data);
            userJson = {
                "username":data.username,
                "icon":data.icon,
                "email":data.email
            }
            userJsonIcon = userJson.icon;
            userJsonName = userJson.username;
            userJsonEmail = userJson.email;
            if (userJsonIcon!==null){
                headerButtonLogged.style.display="flex"
                userIcon.setAttribute("src","image/"+userJsonIcon)
            }
        } else {
            headerButton.style.display="flex"
            console.log("not 200");
            return null;
        }
}

getUser().then();

function showDropDown(){
    if(userIcon.id === "user-icon-img-current"){
        dropDownBox.style.display="block"
    }
}

function mounted() {
    document.addEventListener("mouseup", e => {
            if (!dropDownBox.contains(e.target)) {
                dropDownBox.style.display="none"
        }
    });
}
mounted()

userIcon.addEventListener("click", showDropDown);
