let url = window.location.href;
let id = url.split("/attraction/")[1]
let currentIndex = 0;
let data;
let frontImage = document.getElementById("arrow_button_left");
let nextImage = document.getElementById("arrow_button_right");
let bookButton = document.getElementById("book_button");


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
  document.getElementById("circle2").style.display = "block";
  document.getElementById("circle4").style.display = "none";
  document.getElementsByClassName("money")[0].innerHTML = " 新台幣2000元";
}
function selectNoon(){
  document.getElementById("circle2").style.display = "none";
  document.getElementById("circle4").style.display = "block";
  document.getElementsByClassName("money")[0].innerHTML = " 新台幣2500元";
}

function newBooking(){
  if(document.getElementById("webFunction_signin").style.display == "none" ){
    deleteBooking();
  }else{
    modal.style.display = "block";
    signinBox.style.display = "block"
    signupBox.style.display = "none";
  }
}
function createBooking(){
  let date = document.getElementById("book_date");
  if(document.getElementById("circle2").style.display == "block"){
    fetch("/api/booking" , {
      method : "POST",
      headers : {"content-type" : "application/json"},
      body : JSON.stringify({
        attractionId : id,
        date : date.value,
        time : "上午9點到下午4點",
        price : "2000"
      })
    })
    .then(result => result.json())
    .then(response => {
      if(response.ok == true){
        document.location.href = "/booking";
      }
    })
    .catch(error => console.log(error))
  }else if(document.getElementById("circle4").style.display == "block"){
    fetch("/api/booking" , {
      method : "POST",
      headers : {"content-type" : "application/json"},
      body : JSON.stringify({
        attractionId : id,
        date : date.value,
        time : "中午12點到晚上7點",
        price : "2500"
      })
    })
    .then(result => result.json())
    .then(response => {
      if(response.ok == true){
        document.location.href = "/booking";
      }
    })
    .catch(error => console.log(error))
  }
}
function deleteBooking(){
  fetch("/api/booking" , {
    method: "DELETE",
    headers : {"content-type" : "application/json"}
  })
  .then(result => result.json())
  .then(response => {
    if (response.ok == true){
      createBooking();
    }
  })
  .catch(error => console.log(error))
}
//開始預定按鈕(bookButton)
bookButton.addEventListener("click" , newBooking)
//初始化畫面
async function init() {
  await getAttraction();
  addAttraction();
}
frontImage.addEventListener("click", frontPage)
nextImage.addEventListener("click", nextPage)
window.addEventListener("load", () => {
  isMember();
  init();
});

