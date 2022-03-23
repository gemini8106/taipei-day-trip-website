
let searchButton= document.getElementById("searchButton");
let input= document.getElementById("inputKeyword");
let priviousKeyword= '';
//立flag(isloading)預設為false，fetch前為開啟，fetch完關閉
let isLoading= false;
searchButton.addEventListener("click", queryKeyword)
input.addEventListener("keypress",(e)=> {
  if (e.key=== "Enter"){
    queryKeyword()
  }
})

function queryKeyword(){
  let keyword= input.value;
  if (keyword!= "" && priviousKeyword!= keyword){
    //先將畫面清空
    document.getElementsByClassName("attractionsContainer")[0].innerHTML= "";
    priviousKeyword= keyword;
    // console.log(priviousKeyword)
    // console.log(keyword)
    if(!isLoading){
      getKeyword(0, keyword);
    }
  } else if(keyword!= "" && priviousKeyword== keyword){
    return false;
  }
}

function getKeyword(page, keyword){
  isLoading= true;
    fetch(`/api/attractions?page=${page}&keyword=${keyword}`)
    .then(response=> response.json())
    .then(data=> {
      let source= data.data
      let nextPage= data.nextpage
      isLoading= false;
      if (source== null&& nextPage== null){
        document.getElementsByClassName("attractionsContainer")[0].innerHTML="查無景點";
      }
      else if(source && nextPage== null){
          for(let i in source){
          let image= source[i].images[0];
          let name= source[i].name;
          let mrt= source[i].mrt;
          let category= source[i].category;
          let id= source[i].id;
          addattractions(image, name, mrt, category, id);
        }
        window.onscroll = () => false;
      }
      else if(source && nextPage){
        for(let i in source){
          let image= source[i].images[0];
          let name= source[i].name;
          let mrt= source[i].mrt;
          let category= source[i].category;
          let id= source[i].id;
          addattractions(image, name, mrt, category, id);
        } 
          window.onscroll= function() {
          let scrollable= document.documentElement.scrollHeight - window.innerHeight;
          let scrolled= window.scrollY+ 50;
          if(Math.floor(scrolled)> scrollable && isLoading== false){ 
            getKeyword(nextPage, keyword);
           }
          }
      }
    })
    .catch(error=> console.log(error))
  
}
//首頁呈現
function getData(page){
  isLoading = true;
  fetch(`/api/attractions?page=${page}`)
    .then(response=> response.json())
    .then(data=>{
      let source= data.data;
      let nextPage= data.nextpage;
      for(let i in source){
        let image= source[i].images[0];
        let name= source[i].name;
        let mrt= source[i].mrt;
        let category= source[i].category;
        let id= source[i].id;
        addattractions(image, name, mrt, category, id);
        isLoading = false;
      }
      if(nextPage) {
        window.onscroll= function() {
          let scrollable= document.documentElement.scrollHeight - window.innerHeight;
          let scrolled= window.scrollY+ 50;
          if(Math.floor(scrolled)> scrollable && isLoading== false){
            getData(nextPage);
          }
        }
      } else {
        window.onscroll = () => false;
      }
      // window.addEventListener("scroll",()=>{
      //   let scrollable= document.documentElement.scrollHeight - window.innerHeight;
      //   let scrolled= window.scrollY+ 50;
      //   console.log(scrollable);
      //   console.log(Math.floor(scrolled));
      // })
    })
    .catch(error=> console.log(error))
}

function addattractions(image, name, mrt, category, id){
  
    let addBox= document.createElement("div");
    addBox.className= "attractionBox";
    document.getElementsByClassName("attractionsContainer")[0].appendChild(addBox);
    addBox.onclick= function(){window.location= `/attraction/${id}`}

    let addImage= document.createElement("img");
    addImage.className= "attractionImage";
    addImage.src= image;
    addBox.appendChild(addImage);

    let addAttractionsName= document.createElement("div");
    addAttractionsName.className= "attractionName";
    let attractionName= document.createTextNode(name)
    addAttractionsName.appendChild(attractionName);
    addBox.appendChild(addAttractionsName)

    let addInformation= document.createElement("div");
    addInformation.className= "attractionInformation";
    let addMrt= document.createElement("div");
    addMrt.className= "attractionMrt";
    let mrtText= document.createTextNode(mrt);
    addMrt.appendChild(mrtText);
    addInformation.appendChild(addMrt);

    let addCategory= document.createElement("div");
    addCategory.className= "attractionCategory";
    let categoryText= document.createTextNode(category);
    addCategory.appendChild(categoryText);
    addInformation.appendChild(addCategory);
    
    addBox.appendChild(addInformation);
  }
//window一開始load便去取getdata
window.addEventListener("load", () => {
  if(!isLoading) {
    getData(0);
  }
})

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






