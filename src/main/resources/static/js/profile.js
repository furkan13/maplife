let followUserBtn= document.getElementById("followUserBtn")
let followUserForPage=document.getElementById("followUserBtn-forPage")
let profileUsername=document.getElementById("profileUsername").innerText
let unFollowBtnForPage=document.getElementById("unFollowBtn-forPage")
let unFollowBtn=document.getElementById("unFollowBtn")


const unFollowUser = async function () {
    const userObject = {
        username: profileUsername,
    }
    const response = await fetch("/api/unFollowUser", {
        method: "PUT",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(userObject),
    })
    if (response.status == "200") {
        followUserForPage.style.display="flex"
        unFollowBtn.style.display="none"
        unFollowBtnForPage.style.display="none"
    }
    else {
        console.log("not 200")
    }
}

const followUser = async function () {
    const userObject = {
        username: profileUsername,
    }
    const response = await fetch("/api/followUser", {
        method: "PUT",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(userObject),
    })
    if (response.status == "200") {
        followUserBtn.style.display="none"
        followUserForPage.style.display="none"
        unFollowBtnForPage.style.display="flex"
    }
    else {
        console.log("not 200")
    }
}



followUserBtn.addEventListener("click",followUser)
followUserForPage.addEventListener("click",followUser)
unFollowBtn.addEventListener("click",unFollowUser)
unFollowBtnForPage.addEventListener("click",unFollowUser)