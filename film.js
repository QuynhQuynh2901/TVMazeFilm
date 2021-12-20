var lastOrder = "";
var multiverse = false;
var movies = [];



function search(){ 
  let strSearch = document.getElementById("searchs").value
  if (strSearch != "") {
    if (isNaN(strSearch)) {
      document.querySelector(".pagination").style.display = "none"
      return "https://api.tvmaze.com/search/shows?q=" + strSearch

    }
    else{
      document.querySelector(".pagination").style.display = "none"
       return "https://api.tvmaze.com/shows/" + strSearch
    }

     
  }
  else
    return "https://api.tvmaze.com/shows";
     // return "https://api.tvmaze.com/search/shows?q=a";
}
function loadData() {
  console.log("ahhhh: ", search())
  $.ajax({
    type: "GET",
    url: search(),
    success: function (data) {
     movies = [];
     if(Array.isArray(data)){
      for(let i = 0; i < data.length; i++){
        movies.push(data[i].show??data[i])
      }
      console.log("mang: ", movies)
     }
     else
      movies.push(data)
      console.log("dataqqq: ", data)
      console.log("mang: ", movies)
    filter();
    },
    error: function () {
      alert("error loading data");
    }
  });

};
  
$(document).ready(async function(){
  key = search()
 await $.get(key , function(data, status){
      for(let i = 0; i < data.length; i++){
        movies.push(data[i])
      }
     
      filter();
      // if(movies.length > 10)
      
 })
 // if(movies.length > 10)
 // {

 // }
  showPagin();
})


function filter() {
  let choice = document.getElementById("sortFilms").value;

  if (choice == "premiered") { arraySort(movies, "premiered"); }

  arraySort(movies, choice);


  printFilm();
}
//sắp xếp các thuộc tính của objet
function arraySort(vet, x) {
  vet.sort(function compare(a, b) {
     //return (new Date(b.show[x]).getFullYear() < new Date(a.show[x]).getFullYear()) ? -1 : (new Date(b.show[x]).getFullYear() > new Date(a.show[x]).getFullYear() ? 1 : 0);
     return (new Date(b[x]).getFullYear() < new Date(a[x]).getFullYear()) ? -1 : (new Date(b[x]).getFullYear() > new Date(a[x]).getFullYear() ? 1 : 0);
  });

  return vet;

}

function printFilm(index) {
  //console.log("data render new", getItemByIndex())
  var ordem = document.getElementById("sortFilms").value
  var filter = ordem == "premiered" ? "premiered: " : "ended: "
  var div = document.querySelector('.container-total') 
  div.innerHTML = "" 
  let object = getItemByIndex(index);
  console.log("object: ", object)
   // let next = document.querySelector(".next a")
   //  let prev = document.querySelector(".prev a")
   // if(next && prev){

   //   next.addEventListener("click", printFilm(index+1));
   //    prev.addEventListener("click", printFilm(index-1));
   // }

  for (let movie of object) { 
    if(movie != undefined){
    let hasShow = movie?.show ?? movie

    let star = "<span><i class='fas fa-star'></i></span>"
    let star_half = "<span><i class='fas fa-star-half-alt'></i></span>"
    let totalStar = ""
    let lenRating
    if(hasShow.rating.average != null){
      lenRating = hasShow.rating.average/ 2
    }
   
    for(let i = 0 ; i < lenRating - 1; i++){
      totalStar += star;
    }

    if(lenRating % 2 !=0)
    {
      totalStar += star_half;
    }

      totalStar = hasShow.rating.average == null ? "waiting for more votes" : ("<div class='rating'>" +  totalStar + "</div>")
      div.innerHTML +=
   `
      <a  onclick="printInfor(${hasShow.id})" data-linkpagina="${hasShow.officialSite}"> 
        <div class="container-movies">
          <h2 class="center">${hasShow.name}<br>${filter}: ${parseInt(ordem == "premiered" ? new Date(hasShow.premiered).getFullYear() : new Date(hasShow.ended).getFullYear())}<br>
            ${totalStar}
          </h2><img src="${hasShow.image.medium}" alt="${hasShow.name}">
        </div>
      </a>
    `
    }

  }
  

}
function testDay(a){
  let day = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
  if(a == day)
    return "Everyday"
  if(a.toString() == "Monday,Tuesday,Wednesday,Thursday,Friday")
    return "Weekdays"
  return a
}


function printInfor(id) {
  console.log("id: ", id)
  console.log("fffff", movies)
  let movie = movies.filter(a => a.id === id)[0]
  console.log("print phim: ", movie)
  let tagBody = document.querySelector("body");
  let tagDivGeral = document.createElement("div");
  let tagDivInfor = document.createElement("div");
  let tagDivInforDetail = document.createElement("div");
  let tagButton = document.createElement("button");
  let tagImage = document.createElement('img')
  tagDivGeral.innerHTML = "";
  tagDivInfor.appendChild(tagButton);
  tagDivInfor.appendChild(tagDivInforDetail);
  tagDivGeral.appendChild(tagDivInfor);
  tagBody.appendChild(tagDivGeral);

  tagDivGeral.classList.add("modal-infor-geral");
  tagDivGeral.classList.add("center");
  tagDivGeral.addEventListener("click", closeInfor);

  tagDivInfor.classList.add("modal-infor-trailer");

  tagDivInforDetail.classList.add("modal-infor-iframe");
  
  tagDivInforDetail.appendChild(tagImage)
  tagImage.src = movie.image.medium
  let day = testDay(movie.schedule.days)
  tagDivInforDetail.innerHTML += 
  `<div>
      <h3>Show Infor</h3>
      <p>Web channel: ${movie.webChannel?.name || "no channel" }</p>
      <p>Network: ${movie.network?.name}</p>
      <p>Schedule: ${day} at ${movie.schedule.time} (${movie.runtime} phút)</p>
      <p>Status: ${movie.status}</p>
      <p>Show Type: ${movie.type}</p>
      <p>Genres: ${movie.genres?.toString().replace(/,/g,'|') || "not yet"}</p>
      
      <button class="tag">Cast</button>
      <button class="tag">Gallery</button>
      <button class="tag">News</button>
  </div>`

//<p class="description">${movie.show.summary}</p>
  tagButton.classList.add("btn-link")
  tagButton.dataset.href = movie.officialSite
  tagButton.addEventListener("click", goTo)
  tagButton.innerHTML = "Link Offical"
  
}
 
function showPagin(){
  let items = 5;
  let totalIndex = movies.length
  let itemsInIndex = Math.ceil(totalIndex/24)
  let tagBody = document.querySelector("body");
  let tagUlPagin = document.createElement("ul");
  tagUlPagin.classList.add("pagination", "justify-content-center")
   let next = `<li class="page-item next"><a class="page-link"   href="#" >next</a></li>`
   let prev = `<li class="page-item prev"><a class="page-link"  href="#" >prev</a></li>`
   tagUlPagin.innerHTML += prev
  for(let i = 0; i < itemsInIndex; i++)
    {  
      tagUlPagin.innerHTML += 
      `
      <li class="page-item"><a class="page-link" href="#" onclick="printFilm(${i})">${i + 1}</a></li>
        
      ` 
    }
    tagUlPagin.innerHTML += next
  tagBody.appendChild(tagUlPagin)
}


 

function getItemByIndex(index = 0){ 

  let moviesByIndex = []
  let start = index * 24;
  let end = start + 24 
  for(let i = start; i < end; i++)
  {
    moviesByIndex.push(movies[i])
  }
  return moviesByIndex;
}



//đóng infor
function closeInfor() {
  document.querySelector(".modal-infor-geral").remove();
}
// //xem thêm thông tin phim
function goTo(e) {
  e.stopPropagation()
  var linkPagina = e.target.closest("button").dataset.href
  window.open(linkPagina)
}