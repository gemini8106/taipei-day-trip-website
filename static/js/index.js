
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
  isMember();
  if(!isLoading) {
    getData(0);
  }
})




