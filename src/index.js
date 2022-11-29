// import './css/styles.css';
import SimpleLightbox from "simplelightbox";
import SimpleLightbox from "simplelightbox/dist/simple-lightbox.esm";
import Notiflix from 'notiflix';
// import fetchSearchPhoto from './fetchSearchPhoto';


const refs = {
  form: document.querySelector('#search-form'),
  container: document.querySelector('.gallery'),
  load: document.querySelector('.load-more'),
  guard: document.querySelector('.js-guard'),
};

const options = {
  root: null,
  rootMargin: '50px',
  threshold: 1.0
};

const observer = new IntersectionObserver(onLoad, options)

let page = 1;
let searchValue = '';

function onLoad(entries, observer){
  entries.forEach(entry =>{
    if(entry.isIntersecting){
console.log('Бачу 😎');
page += 1
}

fetchSearchPhoto(searchValue, page).then(data => {

  refs.container.insertAdjacentHTML('beforeend', createMarkup(data.hits))
  if(data.page === data.totalHits){
    observer.unobserve(refs.guard)
  }
})

    console.log(entries);
  })
}

window.onscroll = function() {
  const scrolled = window.pageYOffset || document.documentElement.scrollTop; // Отримуємо положення скрола
  if(scrolled !== 0){
    // Якщо прокрутка присутня, то робимо елемент прозорим
    refs.form.style.opacity = '0.5';
  }else{
    // Якщо прокрутки немає, то елемент лишається не прозорим
    refs.form.style.opacity = '1';
  };
};

refs.form.addEventListener('submit', onFormSearch);
// refs.load.addEventListener('click', onLoadPhoto);


let gallery = new SimpleLightbox('.photo-card a', {
  close: true,
});

// gallery.refresh();

function onFormSearch(evt){
  evt.preventDefault();
  searchValue = evt.currentTarget.searchQuery.value.trim();

  resetMarkup()
  fetchSearchPhoto(searchValue, page).then(data => {
    if(!data.hits.length){
          Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
          return
        }
      // refs.load.setAttribute('hidden', true)
        Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
        refs.container.insertAdjacentHTML('beforeend', createMarkup(data.hits))
        observer.observe(refs.guard)


  }).catch((err) => console.error(err))
}



function createMarkup(arr){
  const markup = arr.map(({largeImageURL, webformatURL, tags, likes, views, comments, downloads}) => {
     return `<div class="photo-card">
    <a class="gallery__link" href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" height = 180 width = 340/>
    </a>
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
    </div>
  </div>`
  }).join('')
  return markup;
};

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '31629561-0abe0a895cd2152106039f707';
function fetchSearchPhoto(name, page) {
  return fetch(`${BASE_URL}?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`).then(response => {
    if (!response.ok) {
      throw new Error();
    }
    return response.json();
  });
}

function resetMarkup() {
  refs.container.innerHTML = '';
}

// function onLoadPhoto(){
//   fetchSearchPhoto(name).then(data => {
//     if(data.name === data.page) {
//     }

//   })

// }







// // import './css/styles.css';
// import SimpleLightbox from 'simplelightbox';
// import SimpleLightbox from 'simplelightbox/dist/simple-lightbox.esm';
// import Notiflix from 'notiflix';
// // import fetchSearchPhoto from './fetchSearchPhoto';

// const refs = {
//   form: document.querySelector('#search-form'),
//   container: document.querySelector('.gallery'),
//   load: document.querySelector('.load-more'),
//   guard: document.querySelector('.js-guard'),
// };

// const options = {
//   root: null,
//   rootMargin: '500px',
//   threshold: 1.0,
// };

// const observer = new IntersectionObserver(onLoad, options);

// let page = 1;
// let searchValue = '';

// function onLoad(entries, observer) {
//   entries.forEach(entry => {
//     if (entry.isIntersecting) {
//       console.log('Бачу 😎');
//       page += 1;
//     }

//     fetchSearchPhoto(searchValue, page).then(data => {
//       refs.container.insertAdjacentHTML('beforeend', createMarkup(data.hits));
//       if (data.page === data.totalHits) {
//         observer.unobserve(refs.guard);
//       }
//     });

//     console.log(entries);
//   });
// }

// window.onscroll = function () {
//   const scrolled = window.pageYOffset || document.documentElement.scrollTop; // Отримуємо положення скрола
//   if (scrolled !== 0) {
//     // Якщо прокрутка присутня, то робимо елемент прозорим
//     refs.form.style.opacity = '0.5';
//   } else {
//     // Якщо прокрутки немає, то елемент лишається не прозорим
//     refs.form.style.opacity = '1';
//   }
// };

// refs.form.addEventListener('submit', onFormSearch);
// // refs.load.addEventListener('click', onLoadPhoto);

// let gallery = new SimpleLightbox('.photo-card a', {
//   close: true,
// });

// // gallery.refresh();

// function onFormSearch(evt) {
//   evt.preventDefault();
//   searchValue = evt.currentTarget.searchQuery.value.trim();
//   fetchSearchPhoto(searchValue, page)
//     .then(data => {
//       if (!data.hits.length) {
//         Notiflix.Notify.failure(
//           'Sorry, there are no images matching your search query. Please try again.'
//         );
//       }
//       if (data.page !== data.totalHits) {
//         // refs.load.setAttribute('hidden', true)
//         Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
//         refs.container.insertAdjacentHTML('beforeend', createMarkup(data.hits));
//         observer.observe(refs.guard);
//         page += 1;
//       }
//     })
//     .catch(err => console.error(err));
// }

// function createMarkup(arr) {
//   const markup = arr
//     .map(
//       ({
//         largeImageURL,
//         webformatURL,
//         tags,
//         likes,
//         views,
//         comments,
//         downloads,
//       }) => {
//         return `<div class="photo-card">
//     <a class="gallery__link" href="${largeImageURL}">
//     <img src="${webformatURL}" alt="${tags}" loading="lazy" height = 180 width = 340/>
//     </a>
//     <div class="info">
//       <p class="info-item">
//         <b>Likes</b>${likes}
//       </p>
//       <p class="info-item">
//         <b>Views</b>${views}
//       </p>
//       <p class="info-item">
//         <b>Comments</b>${comments}
//       </p>
//       <p class="info-item">
//         <b>Downloads</b>${downloads}
//       </p>
//     </div>
//   </div>`;
//       }
//     )
//     .join('');
//   return markup;
// }

// const BASE_URL = 'https://pixabay.com/api/';
// const API_KEY = '31629561-0abe0a895cd2152106039f707';
// // const CATEGORY =
// //   'backgrounds, fashion, nature, science, education, feelings, health, people, religion, places, animals, industry, computer, food, sports, transportation, travel, buildings, business, music';
// function fetchSearchPhoto(name, page) {
//   return fetch(`${BASE_URL}?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`).then(response => {
//     if (!response.ok) {
//       throw new Error();
//     }
//     return response.json();
//   });
// }

// function resetMarkup() {
//   refs.container.innerHTML = ``;
// }






