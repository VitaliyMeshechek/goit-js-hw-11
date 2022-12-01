import './css/styles.css';
import Notiflix from 'notiflix';
// import { fetchSearchPhoto } from './fetchSearchPhoto';
// import { createMarkup, resetMarkup } from './createMarkup';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// export {fetchSearchPhoto};


const refs = {
  form: document.querySelector('#search-form'),
  container: document.querySelector('.gallery'),
  load: document.querySelector('.load-more'),
  guard: document.querySelector('.js-guard'),
};

let page = 1;
let searchValue = '';


refs.form.addEventListener('submit', onFormSearch);

const options = {
  root: null,
  rootMargin: '50px',
  threshold: 1.0,
};


function onFormSearch(evt) {
  evt.preventDefault();
  searchValue = evt.currentTarget.searchQuery.value.trim();

  resetMarkup();

  fetchSearchPhoto(searchValue, page)
    .then(data => {
       if(!searchValue){
        Notiflix.Notify.info('Empty request, please type not only spaces');
      } else if (data.totalHits){
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        createMarkup(data.hits);
      } else if (!data.hits.length){
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
          return;
        }
    })
    .catch(err => console.error(err.message))
    .finally(() => {
      // console.dir(refs.container.lastElementChild);
      // console.log(refs.container.lastElementChild.getBoundingClientRect());
      observer.observe(refs.container.lastElementChild);
    });
}

let gallery = new SimpleLightbox('.photo-card a');

// const refs = {
//   container: document.querySelector('.gallery'),
// };

function createMarkup(arr) {
  const markup = arr
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
    <a class="gallery__link" href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" height = 180 width = 340/>

    <div class="info">
      <p class="info-item">
        <b>Likes</b>${likes}
      </p>
      <p class="info-item">
        <b>Views</b>${views}
      </p>
      <p class="info-item">
        <b>Comments</b>${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>${downloads}
      </p>
    </div></a>
  </div>`;
      }
    )
    .join('');

  refs.container.insertAdjacentHTML('beforeend', markup);
  gallery.refresh();
}


function resetMarkup() {
  refs.container.innerHTML = '';
}

const observer = new IntersectionObserver(onLoad, options);

function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      fetchSearchPhoto(searchValue, page).then(data => {
        createMarkup(data.hits);
        observer.observe(refs.container.lastElementChild);

        if (refs.container.children.length > data.totalHits) {
          Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
         observer.unobserve(refs.container.lastElementChild);
         return
        }
      });
    }
  });
}



const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '31629561-0abe0a895cd2152106039f707';
async function fetchSearchPhoto(name, page) {
    const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`)
      return response.data;
  }

window.onscroll = function () {
  const scrolled = window.pageYOffset || document.documentElement.scrollTop; // Отримуємо положення скрола
  if (scrolled) {
    // Якщо прокрутка присутня, то робимо елемент прозорим
    refs.form.style.opacity = '0.5';
  } else {
    // Якщо прокрутки немає, то елемент лишається не прозорим
    refs.form.style.opacity = '1';
  }
};











// function onScroll (){
//   const { height: cardHeight } = document
//   .querySelector(".gallery")
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: "smooth",
// });
// }








