import View from './View.js';
import icons from 'url:../../img/icons.svg';

class SearchView extends View {
  _parentElement = document.querySelector('.results');
  searchForm = document.querySelector('.search');
  searchBtn = document.querySelector('.search__btn');
  renderCondition = true;
  itemsPerPage = 10;
  currentPage = 1;

  addHandlerSearch(handler) {
    this.searchForm.addEventListener('submit', handler);
  }

  addHandlerRender(handler) {
    this._parentElement.addEventListener('click', handler);
  }

  getQuery() {
    // We get query & then clear the field & then return query.
    const query = this.searchForm.querySelector('.search__field').value.trim();
    this.#clearInput();
    return query;
  }

  #clearInput() {
    this.searchForm.querySelector('.search__field').value = '';
  }

  renderSpinner() {
    if (this.renderCondition) {
      super.renderSpinner(); // Use parent method
      this.renderCondition = false;
    }
  }

  renderPagination() {
    const totalPages = Math.ceil(this._data.length / this.itemsPerPage);
    const paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = '';

    // Previous button
    if (this.currentPage > 1) {
      const prevBtn = document.createElement('button');
      prevBtn.classList.add('btn--inline', 'pagination__btn--prev');
      prevBtn.innerHTML = `
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${this.currentPage - 1}</span>
    `;
      prevBtn.addEventListener('click', () => {
        this.currentPage--;
        this.generateMarkup();
      });
      paginationContainer.appendChild(prevBtn);
    }

    // Next button
    if (this.currentPage < totalPages) {
      const nextBtn = document.createElement('button');
      nextBtn.classList.add('btn--inline', 'pagination__btn--next');
      nextBtn.innerHTML = `
      <span>Page ${this.currentPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    `;
      nextBtn.addEventListener('click', () => {
        this.currentPage++;
        this.generateMarkup();
      });
      paginationContainer.appendChild(nextBtn);
    }
  }

  generateMarkup() {
    if (!this._data) return;
    // Pagination Logic
    this._parentElement.innerHTML = '';

    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    const paginatedItems = this._data.slice(start, end);

    paginatedItems.forEach(item => {
      const li = document.createElement('li');
      li.classList = 'preview';
      li.innerHTML = ` 
        <a class="preview__link preview__link--active" href="#23232" data-id=${item.id}>
          <figure class="preview__fig">
            <img src=${item.image_url} alt="Test" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${item.title}</h4>
            <p class="preview__publisher">${item.publisher}</p>
          </div>
        </a>
      `;
      this._parentElement.appendChild(li);
    });

    this.renderPagination();
  }
}

export default new SearchView();
