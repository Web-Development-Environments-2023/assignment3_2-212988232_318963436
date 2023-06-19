const { NText } = require("mssql");
const DButils = require("./DButils");
const api_domain = "https://api.spoonacular.com";
const axios = require("axios");

async function favorite(user_id, id, isfav) {
  if (isfav) {
    await DButils.execQuery(
      `insert ignore into favorites values ('${user_id}',${id},CURDATE())`
    );
  } else {
    await DButils.execQuery(
      `delete from favorites where user_id='${user_id}' and id=${id}`
    );
  }
}
async function getFavoriteRecipes(user_id) {
  const recipes_id = await DButils.execQuery(
    `select id from favorites where user_id='${user_id}'`
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
  let { title, image, readyInMinutes, vegetarian, vegan, glutenFree } =
    recipe.previewDetails;
  let servings = recipe.servings;

  let query = `INSERT INTO recipes (title, image, readyInMinutes, vegetarian, vegan, glutenFree, recipe_date,servings, user_id)
             VALUES ('${title}', '${image}', '${readyInMinutes}', ${vegetarian}, ${vegan}, ${glutenFree}, CURDATE(),${servings} ,'${user_id}');`;

  let result = await DButils.execQuery(query);
  let id = result.insertId;

  let steps = recipe.steps;
  let ingredients = recipe.ingredients;
  let steps_values = [];
  steps.forEach((step) => {
    steps_values.push([id, step.step_number, step.description]);
  });
  if (steps_values.length > 0) {
    await DButils.execQuerywithvals(
      `INSERT INTO steps (id, step_number, description) values ?`,
      [steps_values]
    );
  }

  let ingredients_values = [];
  let ingredients_recipe_values = [];
  ingredients.forEach((ingredient) => {
    ingredients_values.push([
      ingredient.ingredient_id,
      ingredient.name,
      ingredient.imageURL,
    ]);
    ingredients_recipe_values.push([
      id,
      ingredient.ingredient_id,
      ingredient.amount,
      ingredient.units,
    ]);
  });
  if (ingredients_values.length > 0) {
    await DButils.execQuerywithvals(
      `INSERT IGNORE INTO ingredients (ingredient_id,name, imageURL) values ?`,
      [ingredients_values]
    );
  }
  if (ingredients_recipe_values.length > 0) {
    await DButils.execQuerywithvals(
      `INSERT INTO recipe_ingredients (id, ingredient_id, amount, units) values ?`,
      [ingredients_recipe_values]
    );
  }
}

async function getThreeLastSeens(user_id) {
  const recipes_id = await DButils.execQuery(
    `select id from seens where user_id='${user_id}' order by date desc limit 3`
  );
  return recipes_id;
}

async function setseen(user_id, id) {
  try {
    await DButils.execQuery(
      `insert into seens values ('${user_id}',${id},CURRENT_TIMESTAMP())`
    );
  } catch {
    await DButils.execQuery(
      `update seens set date=CURRENT_TIMESTAMP() where user_id='${user_id}' and id=${id}`
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

async function getRecipe(id) {
  const previewDetails = await DButils.execQuery(
    `select * from recipes where id='${id}'`
  );
  const ingredients = await DButils.execQuery(
    `select * from recipe_ingredients join ingredients on recipe_ingredients.ingredient_id=ingredients.ingredient_id where id='${id}'`
  );
  const steps = await DButils.execQuery(`select * from steps where id='${id}'`);

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
