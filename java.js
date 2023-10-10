document.addEventListener('DOMContentLoaded', function () {
  // Récupérer les éléments HTML pour afficher les films
  const topRatedMoviesContainer = document.getElementById('top-rated-movies');
  const category1Container = document.getElementById('Horror');
  const category2Container = document.getElementById('Action');
  const category3Container = document.getElementById('Romance');

  // Fonction pour récupérer et afficher les films depuis l'API
  function fetchAndDisplayMovies(url, container) {
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
        for (const movieId in data) {
          if (data.hasOwnProperty(movieId)) {
            const movie = data[movieId];
            if (movie) {
              let movieElement = document.createElement('div');
              movieElement.classList.add('video');
              movieElement.innerHTML = `
                <img src="${movie.image}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>Genre: ${movie.genre}</p>
                <p>Date de sortie: ${movie.release_date}</p>
                <p>Score Imdb: ${movie.imdb_score}</p>
                <!-- Ajoutez d'autres informations du film ici -->
              `;
              container.appendChild(movieElement);
            }
          }
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des données depuis l\'API :', error);
      });
  }

  // URL de l'API pour les films les mieux notés
  const topRatedMoviesUrl = 'http://localhost:5000/api/v1/titles/?imdb_score_min=8.5';
  fetchAndDisplayMovies(topRatedMoviesUrl, topRatedMoviesContainer);

  // URL de l'API pour la Catégorie Horror
  const category1Url = 'http://localhost:5000/api/v1/titles/?genre=Horror';
  fetchAndDisplayMovies(category1Url, category1Container);

  // URL de l'API pour la Catégorie Action
  const category2Url = 'http://localhost:5000/api/v1/titles/?genre=Action';
  fetchAndDisplayMovies(category2Url, category2Container);

  // URL de l'API pour la Catégorie Romance
  const category3Url = 'http://localhost:5000/api/v1/titles/?genre=Romance';
  fetchAndDisplayMovies(category3Url, category3Container);
});





