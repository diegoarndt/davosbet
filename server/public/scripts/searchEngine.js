// // document.addEventListener("DOMContentLoaded", () => {
// console.log(123);
// var myHeaders = new Headers();
// myHeaders.append("x-rapidapi-key", "2d2d62d406d399b009f7ce00bf464f36");
// myHeaders.append("x-rapidapi-host", "v3.football.api-sports.io");

// var requestOptions = {
//   method: "GET",
//   headers: myHeaders,
//   redirect: "follow",
// };

// function getTeam(query) {
//   fetch("https://v3.football.api-sports.io/teams?name=" + query, requestOptions)
//     // fetch("https://v3.football.api-sports.io/leagues/seasons", requestOptions)
//     // fetch(
//     //   "https://v3.football.api-sports.io/fixtures?league=39&season=2022",
//     //   requestOptions
//     // )
//     .then((response) => response.json())
//     .then((result) => {
//       console.log(result);
//       data = result;
//       team.innerHTML = data.response[0].team.name;
//       venue.innerHTML = data.response[0].venue.name;
//       capacity.innerHTML = data.response[0].venue.capacity;
//       // logo.innerHTML = data.response[0].venue.image;
//       logo.src = data.response[0].venue.image;
//       console.log(data.response[0].team.name);
//       console.log(data.response[0].venue.name);
//       console.log(data.response[0].venue.capacity);
//       console.log(data.response[0].venue.image);

//       //saving constant
//       // const teamValue = data.response[0].team.name;
//       // const venueValue = data.response[0].venue.name;
//       // const capacityValue = data.response[0].team.name;

//       // console.log(teamValue);
//       // console.log(venueValue);
//       // console.log(capacityValue);
//       // localStorage.setItem("team-name", teamValue);
//       // localStorage.setItem("venue-name", venueValue);
//       // localStorage.setItem("capacity-name", capacityValue);
//     })
//     .catch((error) => console.log("error", error));
// }

// submit.addEventListener("click", (e) => {
//   /*it will stop page from reloading */
//   e.preventDefault();
//   getTeam(query.value);
//   // location.redirect("./result.html");
// });

// getTeam("Barcelona");
// // });

//new code
console.log(123);

var data;
var myHeaders = new Headers();
myHeaders.append("x-rapidapi-key", "2d2d62d406d399b009f7ce00bf464f36");
myHeaders.append("x-rapidapi-host", "v3.football.api-sports.io");

var requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};

function getTeam(query) {
  fetch("https://v3.football.api-sports.io/teams?name=" + query, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      data = result;
      team.innerHTML = data.response[0].team.name;
      venue.innerHTML = data.response[0].venue.name;
      capacity.innerHTML = data.response[0].venue.capacity;
      logo.src = data.response[0].venue.image;
      console.log(data.response[0].team.name);
      console.log(data.response[0].venue.name);
      console.log(data.response[0].venue.capacity);
      console.log(data.response[0].venue.image);
    })
    .catch((error) => console.log("error", error));
}

submit.addEventListener("click", (e) => {
  e.preventDefault();
  var query = document.getElementById("query").value;
  getTeam(query);
});

getTeam("Barcelona");
