import Notiflix from 'notiflix';
import SlimSelect from 'slim-select';
import axios from 'axios';

axios.defaults.headers.common['x-api-key'] =
  'live_GZbn1fiXEF4OrTTw3HMMHjz6yAdh9XOudhFQZOjRNIfxeQvuKY9F2BoUQ9swCOr8';

const breedSelect = new SlimSelect({
  select: '#breedSelect',
  placeholder: 'Select a breed',
});

const loaderContainer = document.querySelector('.loader-container');
const catInfoContainer = document.querySelector('.cat-info');

function showLoader() {
  loaderContainer.style.display = 'block';
}

function hideLoader() {
  loaderContainer.style.display = 'none';
}

function handleError(error) {
  console.error(error);
  Notiflix.Report.Failure(
    'Oops! Something went wrong!',
    'Try reloading the page!',
    'Reload',
    () => location.reload()
  );
  hideLoader();
}

function fetchBreeds() {
  return axios
    .get('https://api.thecatapi.com/v1/breeds')
    .then(response => {
      const breeds = response.data;

      breeds.forEach(breed => {
        breedSelect.addData({
          text: breed.name,
          value: breed.id,
        });
      });

      hideLoader();
    })
    .catch(error => {
      handleError(error);
    });
}

function fetchCatByBreed(breedId) {
  return axios
    .get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
    .then(response => {
      const catData = response.data[0];
      const catBreed = catData.breeds[0];

      const catInfoHTML = `
        <img src="${catData.url}" alt="Cat Image">
        <h3>${catBreed.name}</h3>
        <p>Description: ${catBreed.description}</p>
        <p>Temperament: ${catBreed.temperament}</p>
      `;

      catInfoContainer.innerHTML = catInfoHTML;
      hideLoader();
    })
    .catch(error => {
      handleError(error);
    });
}

// Event listener pentru schimbarea rasei în selector
breedSelect.slim.on('change', () => {
  const selectedBreedId = breedSelect.selected();
  showLoader();
  fetchCatByBreed(selectedBreedId);
});

// La încărcarea paginii, inițializăm lista de rase
showLoader();
fetchBreeds();
