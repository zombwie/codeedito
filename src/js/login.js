async function login() {
    let pass = document.getElementById('password').value;
    let username = document.getElementById('username').value;

    // check if they are filled in 
    if (pass == '' || username == '') {
        document.getElementById('error').innerHTML = 'Husk og fylle inn alle feltene.';
        return;
    } else {
        document.getElementById('error').innerHTML = '';
        data = { username: username, password: pass };
        // send data to server
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)

        };
        const response = await fetch('/api/login', options);
        const json = await response.json();
        console.log(json);
        // sort response
        if (response.status == 200) {
            window.location.href = '/dashboard';
        } else if (response.status == 401) {
            document.getElementById('error').innerHTML = "Brukernavn eller passord er feil.";
        } else if (response.status == 400) {
            document.getElementById('error').innerHTML = "Husk og fylle inn alle feltene.";
        }
         else {
            document.getElementById('error').innerHTML = "Login feilet. Prøv igjen.";
        }
    }
}

