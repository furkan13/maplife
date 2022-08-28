let followUserBtn= document.getElementById("followUserBtn")
let profileUsername=document.getElementById("profileUsername").innerText
let cancelFollowBtn=document.getElementById("cancelFollowBtn")

function checkFollowUser(){

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
        cancelFollowBtn.style.display="flex"
    }
    else {
        console.log("not 200")
    }
}



followUserBtn.addEventListener("click",followUser)
