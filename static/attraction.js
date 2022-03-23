let url = window.location.href;
let id = url.split("/attraction/")[1]
let currentIndex = 0;
let data;

function getAttraction(){
  return fetch(`/api/attraction/${id}`)
  .then(response => response.json())
  .then(results => {
    if (results.error == true){
    data = results.message; 
    return data;
    }else{data = results.data;
    return data;
    }
  })
  .catch(error => console.log(error))
}

function addAttraction(){
  if(data == "景點編號不正確"){
    document.body.innerHTML = data;
  }else{
    document.getElementsByClassName("attraction_image")[0].style.backgroundImage = `url(${data.images[0]})`;
    //景點名
    let addAttractionName = document.createElement("div");
    addAttractionName.className = "attraction_name";
    let nameText = document.createTextNode(data.name)
    addAttractionName.appendChild(nameText);
    document.getElementsByClassName("attraction_information_container")[0].appendChild(addAttractionName);

    //包mrt & category
    let addInformation = document.createElement("div");
    addInformation.className = "attraction_information";
    addInformation.innerHTML = data.category + " at " + data.mrt;
    document.getElementsByClassName("attraction_information_container")[0].appendChild(addInformation)
    //mrt

    //description
    let descriptionText = document.createTextNode(data.description);
    document.getElementsByClassName("attraction_description")[0].appendChild(descriptionText);

    //address
    let addressText = document.createTextNode(data.address);
    document.getElementById("attraction_address").appendChild(addressText);

    //transport
    let transportText = document.createTextNode(data.transport);
    document.getElementById("attraction_transport").appendChild(transportText);

    createDot();
    let addCurrentDot = document.createElement("div");
    addCurrentDot.id = "black_dot";
    document.getElementsByClassName("dot")[currentIndex].appendChild(addCurrentDot);
  }
}

//初始化畫面
async function init() {
  await getAttraction();
  addAttraction();
}

function frontPage(){
  let maxIndex = data.images.length - 1;
  if (currentIndex > 0){
    currentIndex -= 1;
    document.getElementsByClassName("attraction_image")[0].style.backgroundImage = `url(${data.images[currentIndex]})`;
    currentDot();
  }else {
    currentIndex = maxIndex;
    document.getElementsByClassName("attraction_image")[0].style.backgroundImage = `url(${data.images[currentIndex]})`;
    currentDot();
  }
}

function nextPage(){
  let maxIndex= data.images.length - 1;
  if (currentIndex >= 0 && currentIndex < maxIndex){
    currentIndex += 1;
    document.getElementsByClassName("attraction_image")[0].style.backgroundImage = `url(${data.images[currentIndex]})`;
    currentDot();
  }else {
    currentIndex = 0; 
    document.getElementsByClassName("attraction_image")[0].style.backgroundImage = `url(${data.images[currentIndex]})`;
    currentDot();
  }
}

function createDot(){
  let maxIndex = data.images.length;
  let addDot = document.createElement("div");
  addDot.className = "image_dot_container";
  for (i=0 ; i < maxIndex ; i++){
    let dot = document.createElement("div")
    dot.className = "dot";
    addDot.appendChild(dot);
  }
  document.getElementsByClassName("attraction_image")[0].appendChild(addDot);
}

function currentDot(){
  document.getElementById("black_dot").remove();
  let addCurrentDot = document.createElement("div");
  addCurrentDot.id = "black_dot";
  document.getElementsByClassName("dot")[currentIndex].appendChild(addCurrentDot);
}


//上下半天按鍵
let button1 = document.getElementsByClassName("circle1")[0];
let button2 = document.getElementsByClassName("circle3")[0];
button1.addEventListener("click", selectDaytime)
button2.addEventListener("click", selectNoon)

function selectDaytime(){
  document.getElementsByClassName("circle2")[0].style.display = "block";
  document.getElementsByClassName("circle4")[0].style.display = "none";
  document.getElementsByClassName("money")[0].innerHTML = " 新台幣2000元";
}
function selectNoon(){
  document.getElementsByClassName("circle2")[0].style.display = "none";
  document.getElementsByClassName("circle4")[0].style.display = "block";
  document.getElementsByClassName("money")[0].innerHTML = " 新台幣2500元";
}
let frontImage = document.getElementById("arrow_button_left");
let nextImage = document.getElementById("arrow_button_right");
frontImage.addEventListener("click", frontPage)
nextImage.addEventListener("click", nextPage)
window.addEventListener("load", init);

//會員登入/註冊框
let modal = document.getElementById("modal");
let openSigninBox = document.getElementById("webFunction_signin");
let closeButtonSignin = document.getElementsByClassName("close_button")[0];
let closeButtonSignup = document.getElementsByClassName("close_button")[1];
let signinBox = document.getElementById("signin_box");
let signupBox = document.getElementById("signup_box");

function resetValue(){
  document.getElementById("signin_message").innerHTML = "";
  document.getElementById("signup_message").innerHTML = "";
  document.getElementById("signin_email").value = "";
  document.getElementById("signin_password").value = "";
  document.getElementById("signup_name").value = "";
  document.getElementById("signup_email").value = "";
  document.getElementById("signup_password").value = "";
}

openSigninBox.addEventListener("click",() => {
  modal.style.display = "block";
  signinBox.style.display = "block"
  signupBox.style.display = "none";
});
closeButtonSignin.addEventListener("click", () => {
  modal.style.display = "none";
  signinBox.style.display = "none";
  resetValue();
});
closeButtonSignup.addEventListener("click", () => {
  modal.style.display = "none";
  signupBox.style.display = "none";
  resetValue();
});
window.onclick = (e)=>{
  if (e.target == modal){
    modal.style.display = "none";
    signinBox.style.display = "none";
    signupBox.style.display = "none";
    resetValue();
  }
}
document.getElementById("backto_signup").addEventListener("click", () => {
  signinBox.style.display = "none";
  signupBox.style.display = "block";
  resetValue();
})
document.getElementById("backto_signin").addEventListener("click", () => {
  signinBox.style.display = "block";
  signupBox.style.display = "none";
  resetValue();
})

//fetch資料進去/api/user
//1.signup
let src = "/api/user";
let signupButton = document.getElementById("signup_button");
function signup(){
  let name = document.getElementById("signup_name");
  let email = document.getElementById("signup_email");
  let password = document.getElementById("signup_password");
  fetch(src , {
    method : "POST",
    headers : {"content-type" : "application/json"},
    body : JSON.stringify({
      name : name.value,
      email : email.value,
      password : password.value
    })
  })
  .then(result => result.json())
  .then(checkNewUser=>{
    if(checkNewUser.error == true){
      document.getElementById("signup_message").innerHTML = checkNewUser.message;
      name.value = "";
      email.value = "";
      password.value = "";
    }else{
      document.getElementById("signup_message").innerHTML = "註冊成功，請按下方提示返回登入頁面";
      name.value = "";
      email.value = "";
      password.value = "";
    }
  })
  .catch(error => console.log(error))
}
signupButton.addEventListener("click",signup);

// 2.signin
let signinButton = document.getElementById("signin_button");
function signin(){
  let email = document.getElementById("signin_email");
  let password = document.getElementById("signin_password");
  fetch(src , {
    method : "PATCH",
    headers : {"content-type" : "application/json"},
    body : JSON.stringify({
      email : email.value,
      password : password.value
    })
  })
  .then(result => result.json())
  .then(checkUser => {
    if(checkUser.error == true){
      document.getElementById("signin_message").innerHTML = checkUser.message;
      email.value = "";
      password.value = "";
    }else if(checkUser.ok == true){
      document.getElementById("signin_message").innerHTML = "";
      window.location.reload();
      email.value = "";
      password.value = "";
    }
  })
  .catch(error => console.log(error))
}
signinButton.addEventListener("click" , signin)

//3.確認是否登入為會員
function isMember(){
  fetch(src , {
    method : ["GET"],
    headers:{"content-type" : "application/json"}
  })
  .then(result => result.json())
  .then(checkMember => {
    if (checkMember.data == null){
      document.getElementById("webFunction_signin").style.display = "bolck";
      document.getElementById("webFunction_signout").style.display = "none";
    }else{
      document.getElementById("webFunction_signin").style.display = "none";
      document.getElementById("webFunction_signout").style.display = "bolck";
    }
  })
  .catch(error => console.log(error))
}
window.addEventListener("load" , isMember)

//4.sign out
let signoutButton = document.getElementById("webFunction_signout");
function signout(){
  fetch(src , {
    method : ["DELETE"],
    headers:{"content-type" : "application/json"}
  })
  .then(result => result.json())
  .then(checkSignout => {
    if(checkSignout.ok == true){
      window.location.reload();
    }
  })
  .catch(error => console.log(error))
}
signoutButton.addEventListener("click" , signout)
