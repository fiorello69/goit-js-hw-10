import axios from 'axios';
import SlimSelect from 'slim-select';

axios.defaults.headers.common['x-api-key'] =
  'live_GZbn1fiXEF4OrTTw3HMMHjz6yAdh9XOudhFQZOjRNIfxeQvuKY9F2BoUQ9swCOr8';

document.addEventListener('DOMContentLoaded', function () {
  const breedSelect = new SlimSelect({
    select: '#breed-select',
    placeholder: 'Select a breed',
    allowDeselect: true,
    alwaysOn: false,
    onChange: info => {
      fetchCatByBreed(info.value);
    },
  });

  const loader = document.querySelector('.loader');
  const error = document.querySelector('.error');
  const catInfo = document.querySelector('.cat-info');

  function fetchBreeds() {
    return axios
      .get('https://api.thecatapi.com/v1/breeds')
      .then(response => response.data)
      .catch(handleError);
  }

  function fetchCatByBreed(breedId) {
    loader.style.display = 'block';
    catInfo.style.display = 'none';

    axios
      .get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
      .then(response => {
        const catData = response.data[0];
        displayCatInfo(catData);
      })
      .catch(handleError)
      .finally(() => {
        loader.style.display = 'none';
      });
  }

  function displayCatInfo(catData) {
    const { name, description, temperament } = catData.breeds[0];

    catInfo.innerHTML = `
      <img src="${catData.url}" alt="${name}" />
      <h2>${name}</h2>
      <p><strong>Description:</strong> ${description}</p>
      <p><strong>Temperament:</strong> ${temperament}</p>
    `;

    catInfo.style.display = 'block';
  }

  function handleError(error) {
    console.error(error);
    error.style.display = 'block';
  }

  // Load cat breeds when the page is loaded
  fetchBreeds().then(breeds => {
    breedSelect.setData(
      breeds.map(breed => ({ text: breed.name, value: breed.id }))
    );
  });
});
