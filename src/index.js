import SlimSelect from 'slim-select';
import { toggleLoader } from './loader.js';
import { fetchBreeds, fetchCatByBreed } from './cat-api.js';
import Notiflix from 'notiflix';

function toggleErrorMessage(visible) {
  const errorElement = document.querySelector('.error');
  if (errorElement) {
    errorElement.style.display = visible ? 'block' : 'none';
  }
}

function displayCatInfo(catData) {
  const catInfoElement = document.querySelector('.cat-info');
  if (catInfoElement) {
    if (catData.breeds && catData.breeds.length > 0) {
      const { name, description, temperament } = catData.breeds[0];

      const catCardHTML = `
        <div class="cat-card">
          <img src="${catData.url}" alt="${name}" class="cat-image">
          <div class="cat-details">
            <h2>${name}</h2>
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>Temperament:</strong> ${temperament}</p>
          </div>
        </div>
      `;

      catInfoElement.innerHTML = catCardHTML;
      catInfoElement.style.display = 'block';
    } else {
      console.error('No breed information available');
      catInfoElement.innerHTML = '<p>No breed information available</p>';
      catInfoElement.style.display = 'block';
      Notiflix.Notify.failure('No breed information available');
    }
  }
}

function handleErrors(error) {
  console.error('Error:', error);
  toggleErrorMessage(true);
  Notiflix.Notify.failure(
    'Oops! Something went wrong! Try reloading the page!'
  );
}

document.addEventListener('DOMContentLoaded', function () {
  toggleLoader(false);

  const breedSelect = new SlimSelect({
    select: '#breed-select',
    placeholder: 'Select a breed',
    allowDeselect: true,
    alwaysOn: false,
    onChange: info => {
      toggleLoader(true);
      fetchCatByBreed(info.value)
        .then(catInfo => {
          toggleErrorMessage(false);
          displayCatInfo(catInfo);
        })
        .catch(error => handleErrors(error))
        .finally(() => {
          toggleLoader(false);
        });
    },
  });

  document.querySelector('#breed-select').addEventListener('change', event => {
    const selectedBreedId = event.target.value;

    toggleLoader(true);

    fetchCatByBreed(selectedBreedId)
      .then(catInfo => {
        toggleErrorMessage(false);
        displayCatInfo(catInfo);
      })
      .catch(error => handleErrors(error))
      .finally(() => {
        toggleLoader(false);
      });
  });

  toggleLoader(false);

  fetchBreeds()
    .then(breeds => {
      breedSelect.setData(
        breeds.map(breed => ({ text: breed.name, value: breed.id }))
      );
      toggleErrorMessage(false);
    })
    .catch(error => {
      handleErrors(error);
    })
    .finally(() => {
      toggleLoader(false);
    });
});
