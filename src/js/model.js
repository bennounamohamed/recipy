export const state = {
  recipe: {},
  searchResults: [],
  API_KEY: 'fa44fa6c-502e-4624-9e90-2f4c108b8361',
};

export const loadRecipe = async function (id) {
  try {
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
    );

    if (!res.ok)
      throw new Error(`Failed to get recipe from API: ${res.status}`);

    const data = await res.json();

    state.recipe = data.data;
  } catch (err) {
    alert(err);
    return null;
  }
};

export const getData = async function (item) {
  try {
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes?search=${item}&key=${state.API_KEY}`
    );

    if (!res.ok) throw new Error('Failed to get data. Please try again!');

    const data = await res.json();

    state.searchResults = data.data.recipes;

    if (state.searchResults.length === 0)
      throw new Error('Invalid search Term, please try again!');
  } catch (err) {
    alert(err);
  }
};
