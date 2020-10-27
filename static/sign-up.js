const REQUIRED_FIELD_MESSAGE = "To pole jest wymagane"
document.getElementById('photo').addEventListener('change', function (e) {
    let fileName = e.target.files[0].name;
    let nextSibling = e.target.nextElementSibling
    nextSibling.innerText = fileName
    isValidFile(e.target)
})

document.getElementById('lastname').addEventListener('change', function (e) {
    isValidName(e.target, e.target.id)
})

document.getElementById('firstname').addEventListener('change', function (e) {
    isValidName(e.target, e.target.id)
})

document.getElementById('login').addEventListener('keydown', function (e) {
    if (e.keyCode === 8) {
        let username = e.target.value.slice(0, -1);
        if (username !== '') {
            isValidUsername(e.target, username)
        }
    }
})

document.getElementById('login').addEventListener('keypress', function (e) {
    let username = e.target.value + String.fromCharCode(e.keyCode)
    isValidUsername(e.target, username)
})

document.getElementById('repeated-password').addEventListener('change', function (e) {
    isValidPassword()
})

document.getElementById('submit-button').addEventListener('click', function (e) {
    validateForm(e);
})


function isValidUsername(referenceNode, username) {
    removeMessages([referenceNode.id]);
    return new Promise(resolve => {
        if (username !== '') {
            httpGetAsync('https://infinite-hamlet-29399.herokuapp.com/check/' + username, function (response) {
                let responseValue = JSON.parse(response)[username]
                if (responseValue === 'taken') {
                    addMessage(referenceNode, "Nazwa użytkownika " + username + " jest zajęta")
                    resolve("invalid")
                } else {
                    resolve("valid")
                }
            })
        } else {
            addMessage(referenceNode, REQUIRED_FIELD_MESSAGE)
            resolve("invalid")
        }
    })
}

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
}

function isValidFile(referenceNode) {
    removeMessages([referenceNode.parentNode.parentNode.id]);
    if (referenceNode.files[0] != null) {
        let fileName = referenceNode.files[0].name;
        if (!(fileName.endsWith(".png") || fileName.endsWith(".jpg"))) {
            addMessage(referenceNode.parentNode.parentNode,
                "Plik powienien być w formacie .png lub .jpg");
            return false;
        }
        return true;
    }
    addMessage(referenceNode.parentNode.parentNode,
        REQUIRED_FIELD_MESSAGE);
    return false;
}

function isValidName(referenceNode, referenceNodeId) {
    removeMessages([referenceNodeId]);
    let name = referenceNode.value;
    if (name === '') {
        addMessage(referenceNode, REQUIRED_FIELD_MESSAGE)
        return false;
    }
    if (!containsLettersOnly(name.substring(1)) || !isFirstCharUpperLetter(name) || name.length < 2) {
        addMessage(referenceNode, "To pole musi zawierać tylko litery i zaczynac się od wielkiej litery")
        return false;
    }
    return true;
}

function removeMessages(referenceNodesIds) {
    referenceNodesIds.forEach(id => {
        let element = document.getElementById(id + "-msg");
        if (element != null) {
            element.parentNode.removeChild(element);
        }
    })
}

function containsLettersOnly(text) {
    return !/[^a-ząćęłńóśźż]/.test(text);
}

function isFirstCharUpperLetter(text) {
    return /[A-ZĄĆĘŁŃÓŚŹŻ]/.test(text[0]);
}

function addMessage(referenceNode, message) {
    let tag = document.createElement("p");
    let text = document.createTextNode(message);
    tag.appendChild(text);
    tag.id = referenceNode.id + '-msg'
    tag.classList.add("validation-message");
    insertAfter(referenceNode, tag);
}

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function isValidPassword() {
    let password = document.getElementById("password");
    let repeatedPassword = document.getElementById("repeated-password");
    removeMessages([password.id, repeatedPassword.id]);
    if (password.value === '' && repeatedPassword.value === '') {
        addMessage(password, REQUIRED_FIELD_MESSAGE);
        addMessage(repeatedPassword, REQUIRED_FIELD_MESSAGE);
        return false;
    } else if (password.value !== repeatedPassword.value) {
        addMessage(repeatedPassword, "Hasła muszą być takie same");
        return false;
    } else if (password.value.length < 8) {
        addMessage(repeatedPassword, "Hasło musi mieć przynajmniej 8 znaków");
        return false;
    }
    return true;
}

function validateForm(event) {
    event.preventDefault();
    let username = document.getElementById("login");
    let firstname = document.getElementById("firstname");
    let surname = document.getElementById("lastname");
    let fileInput = document.getElementById("photo");
    let isNameValid = isValidName(firstname, firstname.id);
    let isSurnameValid = isValidName(surname, surname.id);
    let isPasswordValid = isValidPassword();
    let isFileValid = isValidFile(fileInput);
    isValidUsername(username, username.value)
        .then(result => {
            let isUsernameValid = result === 'valid';
            if (isNameValid && isSurnameValid && isPasswordValid && isUsernameValid && isFileValid) {
                document.getElementById("register-form").submit()
            }
        })
}
