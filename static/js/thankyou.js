let url = window.location.href;
let orderNumber = url.split("/thankyou?number=")[1];

function init(){
  fetch(`/api/order/${orderNumber}`)
  .then(result => result.json())
  .then(response => {
    if (response.error == true){
      document.getElementById("order_number").innerHTML = response.message;
    }else{
      if (response.data == null){
        noOrder();
      }else if (response.data.status == 0){
        paySucess(response);
      }else {
        payFail(response);
      }
    }
  })
  .catch(error => console.log(error))
}
//order = null
function noOrder(){
  let textNote = document.createElement("div");
  textNote.className = "order_note";
  textNote.textContent = "查無此訂單";
  document.getElementById("order_message_container").appendChild(textNote);
}
//pay sucess
function paySucess(response){
  let messageContainer = document.getElementById("order_message_container");
  let textNote = document.createElement("div");
  textNote.className = "order_note";
  textNote.textContent = "預定行程成功";
  let textSuccess = document.createElement("div");
  textSuccess.id = "order_success";
  textSuccess.textContent = "付款狀態：付款成功";
  let orderNumber = document.createElement("div");
  orderNumber.textContent = "訂單編號："+response.data.number;
  orderNumber.className = "order_number";
  let textNotice = document.createElement("div")
  textNotice.className = "order_notice";
  textNotice.textContent = "請記住此編號，或到會員中心查詢歷史訂單";
  messageContainer.appendChild(textNote);
  messageContainer.appendChild(textSuccess);
  messageContainer.appendChild(orderNumber);
  messageContainer.appendChild(textNotice);
}
function payFail(response){
  let messageContainer = document.getElementById("order_message_container");
  let textNote = document.createElement("div");
  textNote.className = "order_note";
  textNote.textContent = "預定行程成功";
  let textFail = document.createElement("div");
  textFail.id = "order_fail";
  textFail.textContent = "付款狀態：付款失敗";
  let orderNumber = document.createElement("div");
  orderNumber.textContent = "訂單編號："+response.data.number;
  orderNumber.className = "order_number";
  let textNotice = document.createElement("div")
  textNotice.className = "order_notice";
  textNotice.textContent = "請記住此編號，或到會員中心查詢歷史訂單";
  messageContainer.appendChild(textNote);
  messageContainer.appendChild(textFail);
  messageContainer.appendChild(orderNumber);
  messageContainer.appendChild(textNotice);
}
window.addEventListener("load", async() => {
  await isMember();
  if (userData == null){
    document.location.href = "/";
  }else{
    init();
  }
  })
