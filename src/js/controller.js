import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const searchInput = document.querySelector('.search__field');
const searchBtn = document.querySelector('.search__btn');
const searchResultsDiv = document.querySelector('.results');

const addRecipeBtn = document.querySelector('.nav__btn--add-recipe');
const addRecipeDiv = document.querySelector('.add-recipe-window');
const addRecipeCloseBtn = document.querySelector('.btn--close-modal');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

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

const controlRecipes = async function (id) {
  recipeView.renderSpinner();
  // Load Recipe
  try {
    await model.loadRecipe(id);
    const recipe = model.state.recipe.recipe;
    if (!recipe) throw new Error('Failed to get recipe from the state.');

    // Render Recipe
    recipeView.render(recipe);
  } catch (err) {
    console.log(err);
  }
};

const getFinalRecipe = async function (target) {
  // Traverse up to find the closest <a> element
  while (target && target.tagName !== 'A') {
    target = target.parentElement;
  }

  if (target && target.dataset.id) {
    const id = target.dataset.id;
    controlRecipes(id);
  } else {
    console.error('<a> has no data-id attribute');
  }
};

searchBtn.addEventListener('click', async function (e) {
  e.preventDefault();
  const searchValue = searchInput.value.trim();
  if (searchValue === '') return alert('Search field cannot be empty.');

  try {
    await model.getData(searchValue);
    const data = model.state.searchResults;

    // Clean search render before rendering new one
    searchResultsDiv.innerHTML = '';
    renderSearchResults(data);
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
