import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const searchInput = document.querySelector('.search__field');

const addRecipeBtn = document.querySelector('.nav__btn--add-recipe');
const addRecipeDiv = document.querySelector('.add-recipe-window');
const addRecipeCloseBtn = document.querySelector('.btn--close-modal');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlSearchResults = async function (e) {
  e.preventDefault();
  try {
    // Get search input
    const searchQuery = searchInput.value.trim();
    if (searchQuery === '') throw new Error('Search field cannot be empty.');

    // Render Search Results

    searchView.renderSpinner();
    await model.loadSearchResults(searchQuery);
    const data = model.state.searchResults.resultsArr;
    if (!data) throw new Error('Failed to get recipes from the server.');
    searchView.render(data);
  } catch (err) {
    searchView.renderError(err.message);
  }
};

// get clicked recipe from search results.
const getRecipeHandler = async function (target) {
  // Traverse up to find the closest <a> element
  const recipeLink = target.closest('a'); // Efficient way to find the nearest <a>
  if (!recipeLink || !recipeLink.dataset.id) return;

  controlRecipe(recipeLink.dataset.id);
};

// declaring a seperate function with arguments to use it on the addHandlerRender Helper function.
const displayRecipeHandler = function (e) {
  e.preventDefault();
  getRecipeHandler(e.target);
};

const controlRecipe = async function (id) {
  recipeView.renderSpinner();
  // Load Recipe
  try {
    await model.loadRecipe(id);
    const recipe = model.state.recipe.recipe;
    if (!recipe) throw new Error('Failed to get recipe from the server.');

    // Render Recipe
    recipeView.render(recipe);
  } catch (err) {
    recipeView.renderError(err.message);
  }
};

const init = function () {
  searchView.addHandlerRender(controlSearchResults);
  searchView.addHandlerRender(displayRecipeHandler);
};
init();

addRecipeBtn.addEventListener('click', () => {
  addRecipeDiv.classList.remove('hidden');
});

addRecipeCloseBtn.addEventListener('click', () => {
  addRecipeDiv.classList.add('hidden');
});
