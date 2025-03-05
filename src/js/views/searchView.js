import icons from 'url:../../img/icons.svg';

class SearchView {
  #parentElement = document.querySelector('.results');
  #data;

  render(data) {
    this.#data = data;
    console.log(this.#data);
    this.#clear();
    this.#generateMarkup();
  }

  #clear() {
    this.#parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
          <div class='spinner'>
            <svg>
              <use href=${icons}#icon-loader></use>
            </svg>
          </div>
          `;
    this.#parentElement.innerHTML = '';
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  #generateMarkup() {
    if (!this.#data) return;
    this.#data.forEach(item => {
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
      this.#parentElement.appendChild(li);
    });
  }
}

export default new SearchView();
