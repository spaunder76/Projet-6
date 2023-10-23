document.addEventListener('DOMContentLoaded', function () {
    // Récupérer les éléments HTML pour afficher les films
    const topRatedMoviesContainer = document.getElementById('top-rated-movies');
    const category1Container = document.getElementById('Horror');
    const category2Container = document.getElementById('Action');
    const category3Container = document.getElementById('Romance');

    // Fonction pour gérer le bouton "Suivant"
    function handleNextButton(categoryContainer) {
        // Récupérer les films actuellement visibles
        const visibleMovies = categoryContainer.querySelectorAll('.video:not(.hidden)');

        // Cacher tous les films actuellement visibles
        visibleMovies.forEach(movie => {
            movie.classList.add('hidden');
        });

        // Montrer les films suivants s'ils existent
        for (let i = 0; i < visibleMovies.length + 1; i++) {
            const nextMovie = visibleMovies[i];
            if (nextMovie) {
                nextMovie.classList.remove('hidden');
            }
        }
    }

    // Gérer le clic sur le bouton "Suivant" pour chaque catégorie
    category1Container.querySelector('.next-button').addEventListener('click', () => handleNextButton(category1Container));
    category2Container.querySelector('.next-button').addEventListener('click', () => handleNextButton(category2Container));
    category3Container.querySelector('.next-button').addEventListener('click', () => handleNextButton(category3Container));

    // Fonction pour gérer le bouton "Précédent"
    function handlePrevButton(categoryContainer) {
        // Récupérer les films actuellement visibles
        const visibleMovies = categoryContainer.querySelectorAll('.video:not(.hidden)');

        // Cacher tous les films actuellement visibles
        visibleMovies.forEach(movie => {
            movie.classList.add('hidden');
        });

        // Montrer les films précédents s'ils existent
        for (let i = 0; i < 4; i++) {
            const prevMovie = visibleMovies[i];
            if (prevMovie) {
                prevMovie.classList.remove('hidden');
            }
        }
    }

    // Gérer le clic sur le bouton "Précédent" pour chaque catégorie
    category1Container.querySelector('.prev-button').addEventListener('click', () => handlePrevButton(category1Container));
    category2Container.querySelector('.prev-button').addEventListener('click', () => handlePrevButton(category2Container));
    category3Container.querySelector('.prev-button').addEventListener('click', () => handlePrevButton(category3Container));

    // Fonction pour récupérer et afficher les films depuis l'API
    function fetchAndDisplayMovies(url, container, maxEntries) {
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
                    const moviesToDisplay = results.slice(0, maxEntries); // Limiter le nombre d'entrées à afficher
                    for (const movie of moviesToDisplay) {
                        let movieElement = document.createElement('div');
                        movieElement.classList.add('video');
                        movieElement.innerHTML = `
                            <img src="${movie.image_url}" alt="${movie.title}">
                            <h3>${movie.title}</h3>
                            <p>Genre: ${movie.genres}</p>
                            <p>Date de sortie: ${movie.year}</p>
                            <p>Score Imdb: ${movie.imdb_score}</p>
                        `;
                        container.appendChild(movieElement);
                    }
                    // Masquer les films au-delà des 4 premiers
                    const allMovies = container.querySelectorAll('.video');
                    for (let i = 4; i < allMovies.length; i++) {
                        allMovies[i].classList.add('hidden');
                    }
                } else {
                    console.error('Les données renvoyées ne sont pas dans le format attendu.');
                }
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données depuis l\'API :', error);
            });
    }

    const topRatedMoviesUrl = 'http://localhost:5000/api/v1/titles/?imdb_score_min=9.4';
    fetchAndDisplayMovies(topRatedMoviesUrl, topRatedMoviesContainer, 1);

    const category1Url = 'http://localhost:5000/api/v1/titles/?genre=Horror';
    fetchAndDisplayMovies(category1Url, category1Container, 7);
    const category2Url = 'http://localhost:5000/api/v1/titles/?genre=Action';
    fetchAndDisplayMovies(category2Url, category2Container, 7);

    const category3Url = 'http://localhost:5000/api/v1/titles/?genre=Romance';
    fetchAndDisplayMovies(category3Url, category3Container, 7);
});










  
  
  

  
  
  








