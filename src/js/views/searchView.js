import View from './View.js';

class SearchView extends View {
  _parentElement = document.querySelector('.results');
  searchForm = document.querySelector('.search');
  searchBtn = document.querySelector('.search__btn');
  renderCondition = true;

  addHandlerSearchRender(handler) {
    this.searchForm.addEventListener('submit', handler);
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

  generateMarkup() {
    if (!this._data) return;
    this._data.forEach(item => {
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
  }
}

export default new SearchView();
