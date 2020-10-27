document.querySelector('.custom-file-input').addEventListener('change',function(e){
  let fileName = document.getElementById("photo").files[0].name;
  let nextSibling = e.target.nextElementSibling
  nextSibling.innerText = fileName
})