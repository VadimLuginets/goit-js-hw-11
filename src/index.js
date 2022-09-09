import Notiflix from 'notiflix';
import axios, { Axios } from 'axios';

const API_KEY = '?key=29814541-7f5e674ca7517b50be2aff327';
const URL = 'https://pixabay.com/api/';
let page = 1;

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

formEl.addEventListener('submit', e => {
  e.preventDefault();
  page = 1;
  galleryEl.innerHTML = '';

  getPhotos(formEl.searchQuery.value);
});

loadMoreBtn.addEventListener('click', () => {
  loadMore();
});

function getPhotos(q) {
  axios
    .get(
      `${URL}${API_KEY}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&page=1&per_page=40`
    )
    .then(response => {
      if (response.data.total === 0) {
        return Notiflix.Notify.failure(
          `Sorry, there are no images matching your search query. Please try again.`
        );
      }
      const data = response.data.hits;
      Notiflix.Notify.success(
        `Hooray! We found ${response.data.totalHits} images.`
      );
      if (response.data.hits.length === 40) {
        loadMoreBtn.style.display = 'block';
      }

      createPhotoSheet(data);
    });
}

async function loadMore() {
  try {
    page++;
    const newLoad = await axios
      .get(
        `${URL}${API_KEY}&q=${formEl.searchQuery.value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
      )
      .then(response => {
        const data = response.data.hits;
        console.log(response.data.hits);
        if (response.data.hits.length < 40) {
          Notiflix.Notify.info(
            `We're sorry, but you've reached the end of search results.`
          );
          createPhotoSheet(data);
          loadMoreBtn.style.display = 'none';
          return;
        }
        createPhotoSheet(data);
      });
  } catch (error) {
    console.log(error);
  }
}

function createPhotoSheet(data) {
  const galleryData = data.map(
    ({ webformatURL, tags, likes, views, comments, downloads }) =>
      `<div class="photo-card">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" width="256"/>
          <div class="info">
            <p class="info-item">
              <b>Likes: ${likes}</b>
            </p>
            <p class="info-item">
              <b>Views: ${views}</b>
            </p>
            <p class="info-item">
              <b>Comments: ${comments}</b>
            </p>
            <p class="info-item">
              <b>Downloads: ${downloads}</b>
            </p>
          </div>
        </div>`
  );
  galleryEl.insertAdjacentHTML('beforeend', galleryData.join(''));
}
