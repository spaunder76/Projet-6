document.addEventListener('DOMContentLoaded', function () {
    // Récupérer les éléments HTML pour afficher les films
    const topRatedMoviesContainer = document.getElementById('top-rated-movies');
    const category1Container = document.getElementById('Horror');
    const category2Container = document.getElementById('Action');
    const category3Container = document.getElementById('Romance');

    // Structure HTML pour la fenêtre modale
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalGenre = document.getElementById('modal-genre');
    const modalReleaseDate = document.getElementById('modal-release-date');
    const modalImdbScore = document.getElementById('modal-imdb-score');
    const modalDirectors = document.getElementById('modal-directors');
    const modalActors = document.getElementById('modal-actors');
    const closeModal = document.querySelector('.close');

    // Fonction pour afficher les informations des films dans la fenêtre modale
    function openModal(movie) {
        modalImage.src = movie.image_url;
        modalTitle.textContent = movie.title;
        modalGenre.textContent = `Genre: ${movie.genres}`;
        modalReleaseDate.textContent = `Date de sortie: ${movie.year}`;
        modalImdbScore.textContent = `Score Imdb: ${movie.imdb_score}`;
        modalDirectors.textContent = `Directors: ${movie.directors}`;
        modalActors.textContent = `Actors: ${movie.actors}`;
        modal.style.display = 'block';
        
    }

    // Gestionnaire d'événements pour fermer la fenêtre modale
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Gestionnaire d'événements pour fermer la fenêtre modale en cliquant à l'extérieur
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    function displayMovies(container, movies, startIndex, count) {
        const allMovies = container.querySelectorAll('.video');
        allMovies.forEach(movie => {
            movie.classList.add('hidden');
        });

        if (container === topRatedMoviesContainer) {
            // Afficher un seul film à la fois pour la catégorie "top rated film"
            if (startIndex < movies.length) {
                const movie = movies[startIndex];
                if (movie) {
                    const movieElement = container.querySelector(`.video[data-movie-id="${movie.id}"]`);
                    if (movieElement) {
                        movieElement.classList.remove('hidden');
                        // Ajouter un gestionnaire d'événements pour ouvrir la fenêtre modale
                        movieElement.addEventListener('click', () => {
                            openModal(movie);
                        });
                    }
                }
            }
        } else {
            // Afficher "count" de films pour les autres catégories
            for (let i = startIndex; i < startIndex + count; i++) {
                const movie = movies[i];
                if (movie) {
                    const movieElement = container.querySelector(`.video[data-movie-id="${movie.id}"]`);
                    if (movieElement) {
                        movieElement.classList.remove('hidden');
                        // Ajouter un gestionnaire d'événements pour ouvrir la fenêtre modale
                        movieElement.addEventListener('click', () => {
                            openModal(movie);
                        });
                    }
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
        if (startIndex > 0) {
            startIndex--;
            const visibleMovies = Array.from(categoryContainer.querySelectorAll('.video:not(.hidden)'));
            visibleMovies[visibleMovies.length - 1].classList.add('hidden');
            const prevMovie = categoryContainer.querySelector(`.video[data-movie-id="${categoryContainer.movies[startIndex].id}"]`);
            prevMovie.classList.remove('hidden');
        }
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
        const pageSize = 7;
        const requestOptions = {
            method: 'GET',
            headers: {
                'Origin': window.location.origin,
                'Content-Type': 'application/json'
            }
        };
        fetch(url + `&page_size=${pageSize}`, requestOptions)
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
                            <img src="${movie.image_url}" alt="${movie.title}" class="movie-image">
                            <h3>${movie.title}</h3>
                            <p>Genre: ${movie.genres}</p>
                            <p>Date de sortie: ${movie.year}</p>
                            <p>Score Imdb: ${movie.imdb_score}</p>
                        `;
                        container.appendChild(movieElement);
                        // Ajouter un gestionnaire d'événements pour ouvrir la fenêtre modale
                        movieElement.addEventListener('click', () => {
                            openModal(movie);
                        });
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

    const category1Url = 'http://localhost:5000/api/v1/titles/?genre=Horror';
    fetchAndDisplayMovies(category1Url, category1Container, 7, startIndexCategory1);

    const category2Url = 'http://localhost:5000/api/v1/titles/?genre=Action';
    fetchAndDisplayMovies(category2Url, category2Container, 7, startIndexCategory2);

    const category3Url = 'http://localhost:5000/api/v1/titles/?genre=Romance';
    fetchAndDisplayMovies(category3Url, category3Container, 7, startIndexCategory3);
});













  
  
  

  
  
  








