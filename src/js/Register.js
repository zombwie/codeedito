async function register() {
    let pass = document.getElementById('password').value;
    let username = document.getElementById('username').value;
    let email = document.getElementById('email').value;

    // check if they are filled in
    if (pass == '' || username == '' || email == '') {
        document.getElementById('error').innerHTML = 'Husk og fylle inn alle feltene.';
        return;
    } else {
        document.getElementById('error').innerHTML = '';
        data = { username: username, password: pass, email: email };
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)

        };
        const response = await fetch('/api/register', options);
        const json = await response.json();
        console.log(json);
        if (response.status == 200) {
            window.location.href = '/dashboard';
        } else if (response.status == 500) {
            document.getElementById('error').innerHTML = "Brukernavn eller epost er allerede i bruk.";
        }
         else {
            document.getElementById('error').innerHTML = "Brukeren din er ikke registrert. Prøv igjen.";
        }
    }
}

