import { async } from 'regenerator-runtime';

export const state = {
  recipe: {},
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
