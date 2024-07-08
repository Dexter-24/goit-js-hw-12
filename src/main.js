import { getPicturesByQuery } from './js/pixabay-api.js';
import { renderGallery, clearGallery, toggleLoader, toggleLoadMoreBtn } from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let currentPage = 1;
let currentQuery = '';

const searchForm = document.querySelector('.js-form');
const loadMoreBtn = document.querySelector('#load-more');
const loader = document.querySelector('#loader');
const gallery = document.querySelector('#gallery');

searchForm.addEventListener('submit', handleSearch);
async function handleSearch(event) {
  event.preventDefault();
  const query = event.currentTarget.elements.query.value.trim();

  if (!query) {
    iziToast.error({
      title: 'Error',
      message: '❌ Please enter a search query',
    });
    return;
  }

  currentQuery = query;
  currentPage = 1;
  clearGallery();
  toggleLoader(true);
  toggleLoadMoreBtn(false);

  try {
    const data = await getPicturesByQuery(query, currentPage);
    if (data.hits.length === 0) {
      iziToast.warning({
        title: 'No Results',
        message: 'Sorry, there are no images matching your search query.',
      });
    } else {
      renderGallery(data.hits);
      if (data.totalHits > currentPage * 15) {
        toggleLoadMoreBtn(true);
      }
    }
  } catch (error) {
    onFetchError(error);
  } finally {
    toggleLoader(false);
    searchForm.reset();
  }
}


loadMoreBtn.addEventListener('click', loadMoreImages);
async function loadMoreImages() {
  currentPage += 1;
  toggleLoader(true);
  toggleLoadMoreBtn(false);

  try {
    const data = await getPicturesByQuery(currentQuery, currentPage);
    renderGallery(data.hits);

    if (currentPage * 15 >= data.totalHits) {
      iziToast.info({
        title: 'End of Results',
        message: "We're sorry, but you've reached the end of search results.",
      });
    } else {
      toggleLoadMoreBtn(true);
    }
    smoothScroll();
  } catch (error) {
    onFetchError(error);
  } finally {
    toggleLoader(false);
  }
}

function onFetchError(error) {
  iziToast.error({
    title: 'Error',
    message: `❌ No pictures found. Error: ${error.message}`,
  });
}

function smoothScroll() {
  const { height: cardHeight } = document.querySelector('.gallery-item').getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}