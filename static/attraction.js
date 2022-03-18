let url = window.location.href;
let id = url.split("/attraction/")[1]
let currentIndex = 0;
let data;

function getAttraction(){
  return fetch(`/api/attraction/${id}`)
  .then(response => response.json())
  .then(results => {
    data = results.data;
    return data;
  })
  .catch(error => console.log(error))
}

function addAttraction(){
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
  addInformation.innerHTML = data.category + "at" + data.mrt;
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

  // currentDot();
}

//初始化畫面
async function init() {
  await getAttraction();
  addAttraction();
}

function frontPage(){
  let maxIndex = data.images.length - 1;
  if (currentIndex == 0){
    currentIndex = maxIndex;
    document.getElementsByClassName("attraction_image")[0].style.backgroundImage = `url(${data.images[currentIndex]})`;
    currentDot();
  }else if(currentIndex > 0 && currentIndex <= maxIndex){
    currentIndex -= 1;
    document.getElementsByClassName("attraction_image")[0].style.backgroundImage = `url(${data.images[currentIndex]})`;
    currentDot();
  }
}

function nextPage(){
  let maxIndex= data.images.length - 1;
  if(currentIndex >= 0 && currentIndex < maxIndex){
    currentIndex += 1;
    document.getElementsByClassName("attraction_image")[0].style.backgroundImage = `url(${data.images[currentIndex]})`;
    currentDot();
  }else if (currentIndex = maxIndex){
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
