let bookingData;
let ensureButton = document.getElementById("ensure_booking_button")
let prime;
let phone = document.getElementById("contact_phone");

//取得預定資料並傳回全域，若沒有登入導回首頁
function getBookingData(){
  return fetch("/api/booking" , {
    method : "GET",
    headers:{"content-type" : "application/json"}
    })
  .then(result => result.json())
  .then(response => {
    if(response.error == true){
      document.location.href = "/";
    }else{
      bookingData = response.data;
      return bookingData;
    }
  })
  .catch(error => console.log(error))
}
//拿到全域的資料，做出預定頁面
function createPage(){
  if(bookingData){
    let name = bookingData.attraction.name;
    let address = bookingData.attraction.address;
    let image = bookingData.attraction.image;
    let date = bookingData.date;
    let time = bookingData.time;
    let price = bookingData.price;
    let userName = userData.data.name;
    let userEmail = userData.data.email;
    document.getElementById("attraction_name").innerHTML = name;
    document.getElementById("trip_date").innerHTML = date;
    document.getElementById("trip_time").innerHTML = time;
    document.getElementById("trip_money").innerHTML = "新台幣"+price+"元";
    document.getElementById("attraction_address").innerHTML = address;
    document.getElementById("attraction_image").src = image;
    document.getElementById("trip_information_slogan").innerHTML = "您好，"+userName+"，待預定的行程如下 :";
    document.getElementById("contact_name").value = userName;
    document.getElementById("contact_email").value = userEmail;
    document.getElementById("total_money").innerHTML = "新台幣"+price+"元";
  }else{
    document.getElementById("trip_information_slogan").innerHTML = "您好，"+userData.data.name+"，待預定的行程如下 :";
    deleteJourney();
  }
}
//數值歸零函數
function deleteJourney(){
  document.getElementsByClassName("trip_information")[0].innerHTML = "";
  document.getElementsByClassName("trip_contact_container")[0].innerHTML = "";
  document.getElementsByClassName("trip_creditcard_container")[0].innerHTML = "";
  document.getElementsByClassName("trip_pay_container")[0].innerHTML = "";
  document.getElementsByClassName("hr_container")[0].innerHTML = "";
  document.getElementsByClassName("hr_container")[1].innerHTML = "";
  document.getElementsByClassName("hr_container")[2].innerHTML = "";
  document.getElementById("no_booking").style.display = "block";
}

//信用卡付款
// Display ccv field
let fields = {
  number: {
      element: document.getElementById("card_number"),
      placeholder: '**** **** **** ****'
  },
  expirationDate: {
      element: document.getElementById('card_expiration_date'),
      placeholder: 'MM / YY'
  },
  ccv: {
      element: document.getElementById("card_ccv"),
      placeholder: 'ccv'
  }
}
TPDirect.card.setup({
  fields: fields,
    styles: {
        // Style all elements
        'input': {
            'color': 'gray'
        },
        // Styling ccv field
        'input.ccv': {
            'font-size': '16px'
        },
        // Styling expiration-date field
        'input.expiration_date': {
            'font-size': '16px'
        },
        // Styling card-number field
        'input.card_number': {
            'font-size': '16px'
        },
        // style focus state
        ':focus': {
            'color': 'black'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
    }
  })
TPDirect.card.onUpdate(function (update) {
  // update.canGetPrime === true
  // --> you can call TPDirect.card.getPrime()
  if (update.canGetPrime) {
      // Enable submit Button to get prime.
      ensureButton.removeAttribute('disabled')
  } else {
      // Disable submit Button to get prime.
      ensureButton.setAttribute('disabled', true)
  }
})
ensureButton.addEventListener("click" , function onSubmit(event) {
  event.preventDefault()
  // 取得 TapPay Fields 的 status
  const tappayStatus = TPDirect.card.getTappayFieldsStatus()
  // 確認是否可以 getPrime
  if (tappayStatus.canGetPrime === false) {
      alert('can not get prime')
      return
  }
  // Get prime
  TPDirect.card.getPrime((result) => {
    console.log(result)
      if (result.status !== 0) {
          alert('get prime error ' + result.msg)
          return
      }else{
      prime = result.card.prime;
      console.log(prime)
      sendOrderRequest();
      }
      // send prime to your server, to pay with Pay by Prime API .
      // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
  })
})

//make request body to /api/orders
function sendOrderRequest(){
  fetch("/api/orders" , {
    method : "POST",
    headers : {"content-type" : "application/json"},
    body : JSON.stringify({
      prime : prime,
      order : {
        price : bookingData.price,
        trip : {
          attraction : {
            id : bookingData.attraction.id,
            name : bookingData.attraction.name,
            address : bookingData.attraction.address,
            image : bookingData.attraction.image
          },
          date : bookingData.date,
          time : bookingData.time,
        },
        contact : {
          name : userData.data.name,
          email : userData.data.email,
          phone : phone.value
        }
      }
    })
  })
  .then(result => result.json())
  .then(response => {
    if (response.error == true){
      document.getElementById("pay_message").innerHTML = response.message
    }else{
      document.location.href = "/thankyou?number="+response.data.number;
      deleteOrder();
    }
  })
}

//垃圾桶按鈕
document.getElementById("trashcan").addEventListener("click" , () => {
  deleteOrder();
})
//delete order api
function deleteOrder(){
  fetch("/api/booking" , {
    method: "DELETE",
    headers : {"content-type" : "application/json"}
  })
  .then(result => result.json())
  .then(response => {
    if (response.ok == true){
      deleteJourney();
    }
  })
  .catch(error => console.log(error))
}
//初始化
async function init(){
  await getBookingData();
  createPage();
}
//首頁呈現
window.addEventListener("load", async() => {
  await isMember();
  init();
  })
