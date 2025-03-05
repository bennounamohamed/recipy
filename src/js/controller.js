import * as model from './model.js';
import recipeView from './views/recipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const API_KEY = 'fa44fa6c-502e-4624-9e90-2f4c108b8361';

const recipeContainer = document.querySelector('.recipe');
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

let searchResult;

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

/*
const renderError = function (error) {
  recipeContainer.innerHTML = '';
  const div = document.createElement('div');
  div.classList = 'error';
  div.innerHTML = `
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
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
