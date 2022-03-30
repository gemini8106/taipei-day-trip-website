//會員登入/註冊框
let modal = document.getElementById("modal");
let openSigninBox = document.getElementById("webFunction_signin");
let closeButtonSignin = document.getElementsByClassName("close_button")[0];
let closeButtonSignup = document.getElementsByClassName("close_button")[1];
let signinBox = document.getElementById("signin_box");
let signupBox = document.getElementById("signup_box");
let bookTripButton = document.getElementById("webFunction_book");

let userData;

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
bookTripButton.addEventListener("click" , () => {
  // isMember();
  if(document.getElementById("webFunction_signin").style.display == "none"){
    document.location.href = "/booking";
  }else{
    modal.style.display = "block";
    signinBox.style.display = "block"
    signupBox.style.display = "none";
  }
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
  return fetch(src , {
    method : ["GET"],
    headers:{"content-type" : "application/json"}
  })
  .then(result => result.json())
  .then(checkMember => {
    if (checkMember.data == null){
      document.getElementById("webFunction_signin").style.display = "block";
      document.getElementById("webFunction_signout").style.display = "none";
    }else{
      document.getElementById("webFunction_signin").style.display = "none";
      document.getElementById("webFunction_signout").style.display = "block";
      userData = checkMember;
      return userData;
    }
  })
  .catch(error => console.log(error))
}

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

