const API_KEY = 'fa44fa6c-502e-4624-9e90-2f4c108b8361';
const recipeContainer = document.querySelector('.recipe');

const searchInput = document.querySelector('.search__field');
const searchBtn = document.querySelector('.search__btn');
const searchResultsDiv = document.querySelector('.results');

const addRecipeBtn = document.querySelector('.nav__btn--add-recipe');
const addRecipeDiv = document.querySelector('.add-recipe-window');
const addRecipeCloseBtn = document.querySelector('.btn--close-modal');

const figureDisplay = document.querySelector('.recipe__fig');
const recipeDetailsDisplay = document.querySelector('.recipe__details');
const recipeIngredientsDisplay = document.querySelector(
  '.recipe__ingredient-list'
);
const recipeDirectionsDisplay = document.querySelector('.recipe__directions');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

let searchResult;

// Hide the recipe main display. Until the value is received.
const changeOpacity = function (val) {
  figureDisplay.style.opacity = val;
  recipeDetailsDisplay.style.opacity = val;
  recipeIngredientsDisplay.style.opacity = val;
  recipeDirectionsDisplay.style.opacity = val;
};

changeOpacity(0);

const getData = async function (item) {
  try {
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes?search=${item}&key=${API_KEY}`
    );

    if (!res.ok) throw new Error('Failed to get data. Please try again!');

    const data = await res.json();

    const result = data.data.recipes;

    if (result.length === 0)
      throw new Error('Invalid search Term, please try again!');

    return result;
  } catch (err) {
    alert(err);
  }
};

const renderSearchResults = function (searchResult) {
  if (!searchResult) return;
  searchResult.forEach(item => {
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
    searchResultsDiv.appendChild(li);
  });
};

const getRecipeDetails = async function (id) {
  try {
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
    );

    if (!res.ok) throw new Error(`Failed to get recipe: ${res.status}`);

    const data = await res.json();

    return data;
  } catch (err) {
    alert(err);
    return null;
  }
};

const renderFinalRecipe = function (recipe) {
  changeOpacity(100);

  figureDisplay.innerHTML = `
  
          <img src="${recipe.image_url}" alt="${recipe.title}" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${recipe.title}</span>
          </h1>
  `;

  recipeDetailsDisplay.innerHTML = `
  
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="src/img/icons.svg#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${recipe.cooking_time}</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="src/img/icons.svg#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="src/img/icons.svg#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="src/img/icons.svg#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated">
            <svg>
              <use href="src/img/icons.svg#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round">
            <svg class="">
              <use href="src/img/icons.svg#icon-bookmark-fill"></use>
            </svg>
          </button>
  `;
  // putting this last because other ones are appeneded and this one is selected
  recipe.ingredients.forEach(ingredient => {
    const li = document.createElement('li');
    li.classList.add('recipe__ingredient');
    li.innerHTML = `
              <svg class="recipe__icon">
                <use href="src/img/icons.svg#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${ingredient.quantity}</div>
              <div class="recipe__description">
                <span class="recipe__unit">${ingredient.unit}</span>
                ${ingredient.description}
              </div>
    `;

    recipeIngredientsDisplay.appendChild(li);
  });

  recipeDirectionsDisplay.innerHTML = `
  <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${recipe.publisher}</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${recipe.source_url}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="src/img/icons.svg#icon-arrow-right"></use>
            </svg>
          </a>
  `;
};

/*
const renderError = function (error) {
  recipeContainer.innerHTML = '';
  const div = document.createElement('div');
  div.classList = 'error';
  div.innerHTML = `
            <div>
              <svg>
                <use href="src/img/icons.svg#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${error}</p>`;
  recipeContainer.appendChild(div);
}; */

const getFinalRecipe = async function (target) {
  // Traverse up to find the closest <a> element
  while (target && target.tagName !== 'A') {
    target = target.parentElement;
  }

  if (target && target.dataset.id) {
    const id = target.dataset.id;
    const data = await getRecipeDetails(id);
    if (data) {
      const finalRecipe = data['data']['recipe'];
      console.log(finalRecipe);
      renderFinalRecipe(finalRecipe);
    }
  } else {
    console.error('<a> has no data-id attribute');
  }
};

searchBtn.addEventListener('click', async function (e) {
  e.preventDefault();
  const searchValue = searchInput.value.trim();
  if (searchValue === '') return alert('Search field cannot be empty.');

  try {
    searchResult = await getData(searchValue);

    // Clean search render before rendering new one
    searchResultsDiv.innerHTML = '';
    renderSearchResults(searchResult);
  } catch (err) {
    console.error(err);
  }
});

addRecipeBtn.addEventListener('click', () => {
  addRecipeDiv.classList.remove('hidden');
});

addRecipeCloseBtn.addEventListener('click', () => {
  addRecipeDiv.classList.add('hidden');
});

searchResultsDiv.addEventListener('click', e => {
  e.preventDefault();
  getFinalRecipe(e.target);
});
