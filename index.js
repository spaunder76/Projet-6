document.addEventListener('DOMContentLoaded', function () {
    // Récupérer les éléments HTML pour afficher les films
    const topRatedMoviesContainer = document.getElementById('top-rated-movies');
    const category1Container = document.getElementById('Horror');
    const category2Container = document.getElementById('Action');
    const category3Container = document.getElementById('Romance');

    function displayMovies(container, movies, startIndex, count) {
        const allMovies = container.querySelectorAll('.video');
        allMovies.forEach(movie => {
            movie.classList.add('hidden');
        });

        for (let i = startIndex; i < startIndex + count; i++) {
            const movie = movies[i];
            if (movie) {
                const movieElement = container.querySelector(`.video[data-movie-id="${movie.id}"]`);
                if (movieElement) {
                    movieElement.classList.remove('hidden');
                }
            }
        }
    }

    let startIndexCategory1 = 0;
    let startIndexCategory2 = 0;
    let startIndexCategory3 = 0;

// Fonction pour gérer le bouton "Suivant" pour chaque catégorie
function handleNextButton(categoryContainer, startIndex) {
    startIndex++;
    if (startIndex + 3 < categoryContainer.movies.length) {
        const leftMostMovie = categoryContainer.querySelector('.video:not(.hidden)');
        leftMostMovie.classList.add('hidden');
        const nextMovie = categoryContainer.querySelector(`.video[data-movie-id="${categoryContainer.movies[startIndex + 3].id}"]`);
        nextMovie.classList.remove('hidden');
    }
    return startIndex;
}


    // Gérer le clic sur le bouton "Suivant" pour chaque catégorie
    category1Container.querySelector('.next-button').addEventListener('click', () => {
        startIndexCategory1 = handleNextButton(category1Container, startIndexCategory1);
    });
    category2Container.querySelector('.next-button').addEventListener('click', () => {
        startIndexCategory2 = handleNextButton(category2Container, startIndexCategory2);
    });
    category3Container.querySelector('.next-button').addEventListener('click', () => {
        startIndexCategory3 = handleNextButton(category3Container, startIndexCategory3);
    });

    // Fonction pour gérer le bouton "Précédent" pour chaque catégorie
    function handlePrevButton(categoryContainer, startIndex) {
        startIndex = Math.max(startIndex - 4, 0);
        displayMovies(categoryContainer, categoryContainer.movies, startIndex, 4);
        return startIndex;
    }

    // Gérer le clic sur le bouton "Précédent" pour chaque catégorie
    category1Container.querySelector('.prev-button').addEventListener('click', () => {
        startIndexCategory1 = handlePrevButton(category1Container, startIndexCategory1);
    });
    category2Container.querySelector('.prev-button').addEventListener('click', () => {
        startIndexCategory2 = handlePrevButton(category2Container, startIndexCategory2);
    });
    category3Container.querySelector('.prev-button').addEventListener('click', () => {
        startIndexCategory3 = handlePrevButton(category3Container, startIndexCategory3);
    });

    // Fonction pour récupérer et afficher les films depuis l'API
    function fetchAndDisplayMovies(url, container, maxEntries, startIndex) {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Origin': window.location.origin,
                'Content-Type': 'application/json'
                
            }
            
        };
        fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.hasOwnProperty("results")) {
                    const results = data["results"];
                    container.movies = results;
                    for (const movie of results) {
                        let movieElement = document.createElement('div');
                        movieElement.classList.add('video');
                        movieElement.dataset.movieId = movie.id;
                        movieElement.innerHTML = `
                            <img src="${movie.image_url}" alt="${movie.title}">
                            <h3>${movie.title}</h3>
                            <p>Genre: ${movie.genres}</p>
                            <p>Date de sortie: ${movie.year}</p>
                            <p>Score Imdb: ${movie.imdb_score}</p>
                        `;
                        container.appendChild(movieElement);
                        console.log("API Response for", url, data); 

                    }

                    displayMovies(container, results, startIndex, 4);
                } else {
                    console.error('Les données renvoyées ne sont pas dans le format attendu.');
                }
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données depuis l\'API :', error);
            });
    }

    const topRatedMoviesUrl = 'http://localhost:5000/api/v1/titles/?imdb_score_min=9.4';
    fetchAndDisplayMovies(topRatedMoviesUrl, topRatedMoviesContainer, 1, 0);    
    console.log(fetchAndDisplayMovies)
    const category1Url = 'http://localhost:5000/api/v1/titles/?genre=Horror';
    fetchAndDisplayMovies(category1Url, category1Container, 7, startIndexCategory1);
    const category2Url = 'http://localhost:5000/api/v1/titles/?genre=Action';
    fetchAndDisplayMovies(category2Url, category2Container, 7, startIndexCategory2);

    const category3Url = 'http://localhost:5000/api/v1/titles/?genre=Romance';
    fetchAndDisplayMovies(category3Url, category3Container, 7, startIndexCategory3);
});











  
  
  

  
  
  








