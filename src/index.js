import './sass/main.scss';
import ApiImages from './js/apiService.js'
import getRefs from './js/refs.js'
import markup from "./templates/markup.hbs"
import onImgClick from "./js/modal.js";

import { renderImageCard, clearImageGallery } from './js/helpers.js';

import { showNotice, showError } from "./js/notifications";

const refs = getRefs();

const imagesApiService = new ApiImages();

refs.formEl.addEventListener('submit', onSearch);
refs.listEl.addEventListener('click', onImgClick);

const noticeText = 'There are images on your  query)'
const ErrorText = 'Sorry, no data found. Enter another text';


function onSearch(e) {
    e.preventDefault();
    imagesApiService.searchQuery = e.currentTarget.elements.query.value.trim();

    /// если ввели  пробелы 
    if (imagesApiService.searchQuery === "") {
        showError(ErrorText);
        return;
    }
    //gthtl  новым запросом надо  обновить параметр  page  снова до 1 
    // и  очистить  страницу 

    imagesApiService.resetPage();
    clearImageGallery();

    imagesApiService.fetchData()
        .then((data) => {
            const { hits, totalHits } = data;
            renderImageCard(hits);
            showNotice(noticeText);
            refs.formEl.reset();
        });
    }

//опции
const options = {
    rootMargin: '150px',
}

const observer = new IntersectionObserver(onEntriesObs, options); // создаем экз класса  observer 

// колбек
function onEntriesObs(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting && imagesApiService.searchQuery !== "") {
            imagesApiService.fetchData()
        .then((data) => {
            const { hits, totalHits } = data;
            renderImageCard(hits);
        });
        }
    });
}
observer.observe(document.querySelector('.observer-container'));
console.log(document.querySelector('.observer-container'));












