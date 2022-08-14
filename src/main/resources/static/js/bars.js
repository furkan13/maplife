
let userJsonIcon = null
let userJson = {}
let userJsonName = null
let userJsonEmail = null
const userIcon = document.getElementById("user-icon-img")
function getCookie(cname){
    const name = cname + "=";
    let res= document.cookie.split(';');
    for(let i=0; i<res.length; i++) {
        let cookieData = res[i].trim();
        if (cookieData.indexOf(name)===0)
        {
            return cookieData.substring(name.length,cookieData.length);
        }
    }
}

function GetUserName(){
    let userName = getCookie("userName");
    if(userName){
        return userName;
    }else{
        console.log("ERROE: Can't get 'username' from cookie!");
        return null;
    }
}

const getUser = async function () {

    let userName = GetUserName()
    if (userName != null) {
        const userObject = {
            username: userName,
        }
        const response = await fetch("/api/getUser", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(userObject),
        })
        if (response.status == "200") {
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
                userIcon.setAttribute("src","images/"+userJsonIcon)
                userIcon.setAttribute("class","user-icon-img")
            }
        } else {
            console.log("not 200");
            return null;
        }
    } else {
        console.log("fail to get username");
        return null;
    }
}
getUser().then();



