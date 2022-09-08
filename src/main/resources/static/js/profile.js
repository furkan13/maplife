const followBtn = document.getElementById("followBtn")

let profileUsername=document.getElementById("profileUsername").innerText

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
        followBtn.value="Follow"
        console.log("unfo success")
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
        followBtn.value="Followed"
        console.log("follow success")
    }
    else {
        console.log("not 200")
    }
}

const toggleFollow = async function(e){
    if(e.target.value === "Follow"){
        await followUser()
    }
    else if(e.target.value === "Followed"){
        await unFollowUser()
    }
}

const goToLivePage=function (){
    window.location=""
}

followBtn.addEventListener("click",toggleFollow)