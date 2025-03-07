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

const controlRecipes = async function (id) {
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

const getFinalRecipe = async function (target) {
  // Traverse up to find the closest <a> element
  const recipeLink = target.closest('a'); // Efficient way to find the nearest <a>
  if (!recipeLink || !recipeLink.dataset.id) return;

  controlRecipes(recipeLink.dataset.id);
};

const searchRecipesHandler = async function (e) {
  e.preventDefault();
  try {
    // Get search input
    const searchValue = searchInput.value.trim();
    if (searchValue === '') throw new Error('Search field cannot be empty.');

    // Render Search Results

    searchView.renderSpinner();
    await model.loadSearchResults(searchValue);
    const data = model.state.searchResults.resultsArr;
    if (!data) throw new Error('Failed to get recipes from the server.');
    searchView.render(data);
  } catch (err) {
    searchView.renderError(err.message);
  }
};

const displayRecipeHandler = function (e) {
  e.preventDefault();
  getFinalRecipe(e.target);
};

const init = function () {
  searchView.addHandlerRender(searchRecipesHandler);
  searchView.addHandlerRender(displayRecipeHandler);
};
init();

addRecipeBtn.addEventListener('click', () => {
  addRecipeDiv.classList.remove('hidden');
});

addRecipeCloseBtn.addEventListener('click', () => {
  addRecipeDiv.classList.add('hidden');
});
