import { API_URL } from './config.js';
import { API_KEY } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  searchResults: [],
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}`);

    if (!data) throw new Error('Cannot get LoadRecipe Data.');

    state.recipe = data.data;
  } catch (err) {
    throw err;
  }
};

export const getData = async function (item) {
  try {
    // get data from api and resolve it using helper function getJSON
    const data = await getJSON(`${API_URL}?search=${item}&key=${API_KEY}`);

    if (!data) throw new Error('Cannot get search results Data.');

    state.searchResults = data.data.recipes;

    if (state.searchResults.length === 0)
      throw new Error('Invalid search Term, please try again!');
  } catch (err) {
    throw err;
  }
};
