let subFollowingButton=document.getElementsByClassName("subscription-following-button")
let subFollowingUsername=null
let subFollowingButtonStatus=null
let goToProfileUsername=document.getElementsByClassName("subscription-following-username")
let followingIcon=document.getElementsByClassName("following-icon")

for(let i=0;i<subFollowingButton.length;i++){
    subFollowingButton[i].addEventListener("click",  async function () {
        if (subFollowingButton[i].value === "Followed") {
            subFollowingButtonStatus=subFollowingButton[i]
            subFollowingUsername=document.getElementsByClassName("subscription-following-username")[i].innerHTML
            await unFollowUser()
        } else if (subFollowingButton[i].value  === "Follow") {
            subFollowingButtonStatus=subFollowingButton[i]
            subFollowingUsername=document.getElementsByClassName("subscription-following-username")[i].innerHTML
            await followUser()
        }
    })
}


for(let i=0;i<goToProfileUsername.length;i++){
    goToProfileUsername[i].addEventListener("click",   function () {
        // console.log(goToProfileUsername[i].innerHTML)
        window.location.href="/profile/"+goToProfileUsername[i].innerHTML;
    })
}

for(let i=0;i<followingIcon.length;i++){
    followingIcon[i].addEventListener("click",   function () {
        // console.log(goToProfileUsername[i].innerHTML)
        window.location.href="/profile/"+goToProfileUsername[i].innerHTML;
    })
}


const unFollowUser = async function () {
    const userObject = {
        username: subFollowingUsername,
    }
    const response = await fetch("/api/unFollowUser", {
        method: "PUT",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(userObject),
    })
    if (response.status == "200") {
        subFollowingButtonStatus.value="Follow"
        console.log("unfo success")
    }
    else {
        console.log("not 200")
    }
}

const followUser = async function () {
    const userObject = {
        username: subFollowingUsername,
    }
    const response = await fetch("/api/followUser", {
        method: "PUT",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(userObject),
    })
    if (response.status == "200") {
        subFollowingButtonStatus.value="Followed"
        console.log("follow success")
    }
    else {
        console.log("not 200")
    }
}




