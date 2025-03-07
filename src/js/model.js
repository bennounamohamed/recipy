import { API_URL } from './config.js';
import { API_KEY } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  searchResults: {
    resultsArr: [],
  },
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}`);

    if (!data) throw new Error('Cannot get LoadRecipe Data.');

    state.recipe = data.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    // get data from api and resolve it using helper function getJSON
    const data = await getJSON(`${API_URL}?search=${query}&key=${API_KEY}`);

    if (!data) throw new Error('Cannot get search results Data.');

    state.searchResults.resultsArr = data.data.recipes;

    // checks if query is incorrect or does not exist
    if (state.searchResults.resultsArr.length === 0) {
      throw new Error('Invalid search Term, please try again!');
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};
