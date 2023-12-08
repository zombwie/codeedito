// get profile info and display it in the navbar
async function getprofileinfo() {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const response = await fetch('/api/getuserinfo', options);
    const json = await response.json();
    if (json.error) {
        console.log(json);
        window.location.href = '/login';
    } else {
        if (json.userinfo.profilepicId == null) {
            document.getElementById("profilepics").src = "../img/user.png";
        } else {
        document.getElementById("profilepics").src = "../img/savedimgs/" + json.userinfo.profilepicId;
        }
    }
}
getprofileinfo();