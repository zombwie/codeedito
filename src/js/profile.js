// get profile info and display it on the profile page
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
        console.log(json);
        console.log(json.userinfo.brukernavn);
        document.getElementById('username').innerHTML = json.userinfo.brukernavn;
        document.getElementById('email').innerHTML = json.userinfo.epost;
    }
}
getprofileinfo();

async function føllbruker() {
    let brukernavn = document.getElementById('brukervillfolle').value;

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ brukernavn: brukernavn })
    };
    const response = await fetch('/api/follbruker', options);
}