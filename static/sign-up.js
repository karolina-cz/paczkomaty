let isFormValid = {
    'firstname': false,
    'lastname': false,
    'login': false,
    'password': false,
    'photo': false
}
document.getElementById('photo').addEventListener('change', function (e) {
    let fileName = e.target.files[0].name;
    let nextSibling = e.target.nextElementSibling
    nextSibling.innerText = fileName
    isFormValid['photo'] = isValidFile(e.target);
})

document.getElementById('lastname').addEventListener('change', function (e) {
    isFormValid['lastname']=isValidName(e.target, e.target.id)
})

document.getElementById('firstname').addEventListener('change', function (e) {
    isFormValid['firstname'] = isValidName(e.target, e.target.id)
})

document.getElementById('login').addEventListener('keydown', function (e) {
    if (e.keyCode === 8) {
        let username = e.target.value.slice(0, -1);
        if(username !== ''){
            isFormValid['login'] = isValidUsername(e.target, username)
        }
    }
})

document.getElementById('login').addEventListener('keypress', function (e) {
    let username = e.target.value + String.fromCharCode(e.keyCode)
    isFormValid['login'] = isValidUsername(e.target, username)
})

document.getElementById('repeated-password').addEventListener('change', function (e) {
    isFormValid['password'] = isValidPassword()
})

document.getElementById('submit-button').addEventListener('click', function (e) {
    validateForm(e);
})


function isValidUsername(referenceNode, username) {
    removeMessages([referenceNode.id]);
    httpGetAsync('https://infinite-hamlet-29399.herokuapp.com/check/' + username, function (response) {
        let responseValue = JSON.parse(response)[username]
        if (responseValue === 'taken') {
            addMessage(referenceNode, "validation-message", "Nazwa użytkownika " + username + " jest zajęta")
            return false;
        }
        return true;
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
    removeMessages([referenceNode.parentNode.id]);
    if (referenceNode.files[0] != null) {
        let fileName = referenceNode.files[0].name;
        if (!(fileName.endsWith(".png") || fileName.endsWith(".jpg"))) {
            addMessage(referenceNode.parentNode, "validation-message",
                "Plik powienien być w formacie .png lub .jpg");
            return false;
        }
        return true;
    }
    return true;
}

function isValidName(referenceNode, referenceNodeId) {
    removeMessages([referenceNodeId]);
    let name = referenceNode.value;
    if (!containsLettersOnly(name)) {
        addMessage(referenceNode, "validation-message", "To pole powinno zawierać tylko litery")
        return false;
    }
    if (name === '') {
        addMessage(referenceNode, "validation-message", "To pole musi być uzupełnione")
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
    return !/[^a-zA-Z]/.test(text);
}

function addMessage(referenceNode, messageType, message) {
    let tag = document.createElement("p");
    let text = document.createTextNode(message);
    tag.appendChild(text);
    tag.id = referenceNode.id + '-msg'
    tag.classList.add(messageType);
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
        addMessage(password, "validation-message", "To pole musi być uzupełnione");
        addMessage(repeatedPassword, "validation-message", "To pole musi być uzupełnione");
        return false;
    } else if (password.value !== repeatedPassword.value) {
        addMessage(repeatedPassword, "validation-message", "Hasła muszą być takie same");
        return false;
    }
    return true;
}

function validateForm(e) {
    for(let keyValue in isFormValid){
        console.log(keyValue + isFormValid[keyValue])
    }
    e.preventDefault()
}