//Netflix movie file (картотека фільмів Нетфлікс)
var NetflixsMovies = {
"The Witcher (Відьмак)": {
releaseDate: 2020,seasons: 1,genre: ["фентезі", "трилер", "історичний"]
},
"Altered Carbon (Видозмінений вуглець)": {
releaseDate: 2019, seasons: 2, genre: ["фантастика", "детектив", "бойовик"]
},
"Lucifer (Люцифер)": {
releaseDate: 2019, seasons: 5, genre: ["фентезі", "комедія", "детектив"]
}
};

//if we want to get info (якщо бажаємо отримати інфо)
var Witcher = NetflixsMovies["The Witcher (Відьмак)"];
Witcher.genre

//when you need to add a new movie (коли треба добавити новий фільм)
var Discovery = {
releaseDate: 2019, seasons: 3, genre: ["фантастика", "пригоди", "космос"]
};
NetflixsMovies["Discovery (Дискавері)"] = Discovery;

//make a list of all movies (скласти перелік усіх фільмів)
Object.keys(NetflixsMovies);
