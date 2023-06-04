const { NText } = require("mssql");
const DButils = require("./DButils");
const api_domain = "https://api.spoonacular.com";
const axios = require("axios");

async function favorite(user_id, recipe_id, isfav) {
  if (isfav) {
    await DButils.execQuery(
      `insert ignore into favorites values ('${user_id}',${recipe_id},CURDATE())`
    );
  } else {
    await DButils.execQuery(
      `delete from favorites where user_id='${user_id}' and recipe_id=${recipe_id}`
    );
  }
}
async function getFavoriteRecipes(user_id) {
  const recipes_id = await DButils.execQuery(
    `select recipe_id from favorites where user_id='${user_id}'`
  );
  return recipes_id;
}

async function getMyRecipes(user_id) {
  const recipes = await DButils.execQuery(
    `select * from recipes where user_id='${user_id}'`
  );
  return recipes;
}

async function createRecipe(user_id, recipe) {
  let { name, imageURL, readyInMinutes, vegiterian, vegan, glutenfree } =
    recipe.previewDetails;
  let numberOfServings = recipe.numberOfServings;

  let query = `INSERT INTO recipes (name, imageURL, readyInMinutes, vegiterian, vegan, glutenfree, recipe_date,numberOfServings, user_id)
             VALUES ('${name}', '${imageURL}', '${readyInMinutes}', ${vegiterian}, ${vegan}, ${glutenfree}, CURDATE(),${numberOfServings} ,'${user_id}');`;

  let result = await DButils.execQuery(query);
  let recipe_id = result.insertId;

  let steps = recipe.steps;
  let ingredients = recipe.ingredients;
  let steps_values = [];
  steps.forEach((step) => {
    steps_values.push([recipe_id, step.step_number, step.description]);
  });

  await DButils.execQuerywithvals(
    `INSERT INTO steps (recipe_id, step_number, description) values ?`,
    [steps_values]
  );

  let ingredients_values = [];
  let ingredients_recipe_values = [];
  ingredients.forEach((ingredient) => {
    ingredients_values.push([
      ingredient.ingredient_id,
      ingredient.name,
      ingredient.imageURL,
    ]);
    ingredients_recipe_values.push([
      recipe_id,
      ingredient.ingredient_id,
      ingredient.amount,
      ingredient.units,
    ]);
  });
  await DButils.execQuerywithvals(
    `INSERT IGNORE INTO ingredients (ingredient_id,name, imageURL) values ?`,
    [ingredients_values]
  );
  await DButils.execQuerywithvals(
    `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, units) values ?`,
    [ingredients_recipe_values]
  );
}

async function getThreeLastSeens(user_id) {
  const recipes_id = await DButils.execQuery(
    `select recipe_id from seens where user_id='${user_id}' order by date desc limit 3`
  );
  return recipes_id;
}

async function setseen(user_id, recipe_id) {
  try {
    await DButils.execQuery(
      `insert into seens values ('${user_id}',${recipe_id},CURRENT_TIMESTAMP())`
    );
  } catch {
    await DButils.execQuery(
      `update seens set date=CURRENT_TIMESTAMP() where user_id='${user_id}' and recipe_id=${recipe_id}`
    );
  }
}
async function getIngerdients(name, number) {
  number = number || 3;
  const ingredients = await axios.get(`${api_domain}/food/ingredients/search`, {
    params: {
      apiKey: process.env.spooncular_apiKey,
      query: name,
      number: number,
    },
  });
  return ingredients.data;
}

async function getRecipe(recipe_id) {
  const previewDetails = await DButils.execQuery(
    `select * from recipes where recipe_id='${recipe_id}'`
  );
  const ingredients = await DButils.execQuery(
    `select * from recipe_ingredients where recipe_id='${recipe_id}'`
  );
  const steps = await DButils.execQuery(
    `select * from steps where recipe_id='${recipe_id}'`
  );

  recipe = {
    recipe: {
      previewDetails: previewDetails,
      ingredients: ingredients,
      steps: steps,
    },
  };
  return recipe;
}

exports.favorite = favorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getMyRecipes = getMyRecipes;
exports.createRecipe = createRecipe;
exports.getThreeLastSeens = getThreeLastSeens;
exports.setseen = setseen;
exports.getIngerdients = getIngerdients;
exports.getRecipe = getRecipe;
