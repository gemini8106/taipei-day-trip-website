let bookingData;

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

function deleteJourney(){
  document.getElementsByClassName("trip_information")[0].innerHTML = "";
  document.getElementsByClassName("trip_contact_container")[0].innerHTML = "";
  document.getElementsByClassName("trip_creditcard_container")[0].innerHTML = "";
  document.getElementsByClassName("trip_pay_container")[0].innerHTML = "";
  document.getElementsByClassName("hr_container")[0].innerHTML = "";
  document.getElementsByClassName("hr_container")[1].innerHTML = "";
  document.getElementsByClassName("hr_container")[2].innerHTML = "";
  // document.getElementById("trip_information_slogan").innerHTML = "您好，"+userName+"，待預定的行程如下:"
  document.getElementById("no_booking").style.display = "block";
}

document.getElementById("trashcan").addEventListener("click" , () => {
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
})

async function init(){
  await getBookingData();
  createPage();
}

window.addEventListener("load", async() => {
  await isMember();
    init();
  })
