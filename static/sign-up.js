var passwordValue = ''
document.getElementById('photo').addEventListener('change',function(e){
  let fileName = e.target.files[0].name;
  let nextSibling = e.target.nextElementSibling
  nextSibling.innerText = fileName
  isValidFile(e.target)
})

document.getElementById('lastname').addEventListener('change', function (e){
  isValidName(e.target, e.target.id)
})

document.getElementById('firstname').addEventListener('change', function (e){
  isValidName(e.target, e.target.id)
})

document.getElementById('login').addEventListener('change', function (e){
  console.log('here')
  httpGetAsync( 'https://infinite-hamlet-29399.herokuapp.com/check/' + e.target.value, function(response) {
    console.log(response)
  })
})

document.getElementById('repeated-password').addEventListener('change', function (e){
  isValidPassword()
})

function isValidUsername(){
    return true;
}

function httpGetAsync(theUrl, callback)
{
  console.log('there')
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
}

function isValidFile(referenceNode){
    removeMessages([referenceNode.id]);
    if(referenceNode.files[0] != null){
        let fileName = referenceNode.files[0].name;
        if(!(fileName.endsWith(".png") || fileName.endsWith(".jpg"))){
            addMessage(referenceNode.parentNode,"validation-message",
                "Plik powienien być w formacie .png lub .jpg");
            return false;
        }
        return true;
    }
    return true;
}
//TODO add generic function for deleting messages
//TODO send form to address
//TODO validate username
function isValidName (referenceNode, referenceNodeId){
    removeMessages([referenceNodeId]);
    let name = referenceNode.value;
    if(!containsLettersOnly(name)){
        addMessage(referenceNode,"validation-message", "To pole powinno zawierać tylko litery")
        return false;
    }
    if(name === ''){
        addMessage(referenceNode,"validation-message", "To pole musi być uzupełnione")
        return false;
    }
    return true;
}

function removeMessages(referenceNodesIds){
    referenceNodesIds.forEach(id => {
        let element = document.getElementById(id + "-msg");
        if(element != null){
            element.parentNode.removeChild(element);
        }
    })
}

function containsLettersOnly(text){
    return !/[^a-zA-Z]/.test(text);
}

function addMessage(referenceNode, messageType, message){
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

function isValidPassword (){
    let password = document.getElementById("password");
    let repeatedPassword = document.getElementById("repeated-password");
    removeMessages([password.id, repeatedPassword.id]);
    if(password.value === '' && repeatedPassword.value === ''){
        addMessage(password, "validation-message", "To pole musi być uzupełnione");
        addMessage(repeatedPassword, "validation-message", "To pole musi być uzupełnione");
        return false;
    }
    else if(password.value !== repeatedPassword.value){
        addMessage(repeatedPassword, "validation-message", "Hasła muszą być takie same");
        return false;
    }
    return true;
}

function validateForm(){
    let firstname = document.getElementById("firstname");
    let surname = document.getElementById("surname");
    let fileInput = document.getElementById("image");
    let isNameValid = isValidName(firstname,firstname.id);
    let isSurnameValid = isValidName(surname, surname.id);
    let isPasswordValid = isValidPassword();
    let isUsernameValid = isValidUsername();
    let isFileValid = isValidFile(fileInput);
    if(!(isNameValid && isSurnameValid && isPasswordValid && isUsernameValid && isFileValid)){
        console.log('something wrong');
        event.preventDefault();
    }
}