const cookieName = "favoriteFilms";
const checkedStar = "fa-star";
const uncheckedStar = "fa-star-o";
let favorites = getFavorites();

//retrieves film data from star wars api by iterating over all films and checks which trilogy it belongs to
function getFilmsData() {
    $.getJSON('https://swapi.dev/api/films/', function(data) {
        let films = data["results"];
        for (let i = 0; i < films.length; i++) {
            let film = films[i];
            let trilogy;
            if (film["episode_id"] > 3 && film["episode_id"] < 7) {
                trilogy = "#first-trilogy-container";
            }
            if (film["episode_id"] < 4) {
                trilogy = "#second-trilogy-container";
            }

            //used to retrieve the film's poster
            // let releaseDate = new Date(film["release_date"]);
            //             // $.getJSON('http://www.omdbapi.com/?apikey=256fd5bb&t=star+wars&y='+releaseDate.getFullYear(), function (posterData) {
            //             //     let posterUrl = posterData['Poster'];
            //
            // })

            addFilm(film, trilogy)
        }
    })
}

//creates the film items in the web page
function addFilm(filmData, trilogySelector) {
    let releaseDate = new Date(filmData["release_date"]);
    let formattedDate = `${releaseDate.getDate()}/${releaseDate.getMonth()+1}/${releaseDate.getFullYear()}`
    let starClass = uncheckedStar;

    //checks film's favorite status
    if (favorites.includes(filmData["episode_id"].toString())) {
        starClass = checkedStar;
    }
    //adds film to the proper trilogy section
    $(trilogySelector).append(`
 <div class="item-container">
 <p class="film-header">
 <span class="is-favorite fa ${starClass}" onclick="toggleFavorite(this)" data-episode-id="${filmData["episode_id"]}">
 </span>
 <p class="film-title">Episode ${filmData["episode_id"]} - ${filmData["title"]}</p>
 </p>
 <p class="film-details"> 
 Released on ${formattedDate}
 </p>
 </div>
 `)
    ;
}

function getFavorites() {
    if (Cookies.get(cookieName) === undefined) {
        return [];
    }
    return Cookies.get(cookieName).split(",");
}

function setFavorites() {
    Cookies.set(cookieName, favorites.join(), {expires: 10*365})
}

function toggleFavorite(elem) {
    let episode_id = elem.getAttribute("data-episode-id");
    //if already favorite
    if (favorites.includes(episode_id.toString())) {
        let index = favorites.indexOf(episode_id.toString());
        favorites.splice(index,1);
        elem.classList.remove(checkedStar);
        elem.classList.add(uncheckedStar);
    }
    //if not in favorites
    else {
        favorites.push(episode_id.toString());
        elem.classList.remove(uncheckedStar);
        elem.classList.add(checkedStar);
    }
    setFavorites();
}

$( document ).ready(function() {
    getFilmsData();
});

