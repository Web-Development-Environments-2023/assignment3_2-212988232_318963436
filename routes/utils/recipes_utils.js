const axios = require("axios");
const e = require("express");
const { map } = require("mssql");
const api_domain = "https://api.spoonacular.com/recipes";
const DButils = require("./DButils");

/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info
 */

async function getRecipeInformation(recipe_id) {
  return await axios.get(`${api_domain}/${recipe_id}/information`, {
    params: {
      includeNutrition: false,
      apiKey: process.env.spooncular_apiKey,
    },
  });
}

async function getRecipeFullDetails(recipe_id, user_id) {
  recipe_info = await getRecipeInformation(recipe_id).then((res) => {
    return getPreviewInformation(res.data, user_id);
  });

  recipe_analyzedInstructions = await axios.get(
    `${api_domain}/${recipe_id}/analyzedInstructions`,
    {
      params: {
        stepBreakdown: false,
        apiKey: process.env.spooncular_apiKey,
      },
    }
  );
  recipe_ingrediants = await axios.get(
    `${api_domain}/${recipe_id}/ingredientWidget.json`,
    {
      params: {
        includeNutrition: false,
        apiKey: process.env.spooncular_apiKey,
      },
    }
  );

  try {
    steps = recipe_analyzedInstructions.data[0].steps;
    ingredients = recipe_ingrediants.data.ingredients;
  } catch (error) {
    steps = [];
  }
  recipe_full_info = {
    id: recipe_info.id,
    title: recipe_info.title,
    readyInMinutes: recipe_info.readyInMinutes,
    aggregateLikes: recipe_info.aggregateLikes,
    vegetarian: recipe_info.vegetarian,
    vegan: recipe_info.vegan,
    glutenFree: recipe_info.glutenFree,
    image: recipe_info.image,
    favorite: recipe_info.favorite,
    servings: recipe_info.servings,
    seen: recipe_info.seen,
    instructions: steps,
    ingredients: ingredients,
  };
  return recipe_full_info;
}
/**
 *
 * @param {*} recipes_id_array
 * @param {*} user_id
 * @returns  recipes preview information
 */
async function getRecipesPreview(recipes_id_array, user_id) {
  let promises = [];
  for (let recipe_id of recipes_id_array) {
    recipe_preview = await getRecipeInformation(recipe_id);
    recipe_preview = await getPreviewInformation(recipe_preview.data, user_id);
    promises.push(recipe_preview);
  }
  return await Promise.all(promises);
}
/**
 * Get recipe information from spooncular response and extract the relevant recipe data
 * @param {*} recipe_info
 * @param {*} user_id
 * @returns recipe information
 *  */
async function searchByName(query, user_id) {
  let { name, cuisine, diet, intolerances, number } = query;
  number = number || 5;

  let recipes = await axios.get(`${api_domain}/complexSearch`, {
    params: {
      query: name,
      cuisine: cuisine,
      diet: diet,
      intolerances: intolerances,
      number: number,
      apiKey: process.env.spooncular_apiKey,
      instructionsRequired: true,
      addRecipeInformation: true,
      includeIngredients: true,
    },
  });
  recipes = recipes.data.results;
  results = [];
  for (let recipe of recipes) {
    results.push(getPreviewInformation(recipe, user_id));
  }
  return await Promise.all(results);
}

async function randomRecipes(query, user_id) {
  let { number, tags } = query;
  number = number || 3;
  let recipes_info = await axios.get(`${api_domain}/random`, {
    params: {
      tags: tags,
      number: number,
      apiKey: process.env.spooncular_apiKey,
    },
  });
  let recipes = [];
  for (let recipe of recipes_info.data.recipes) {
    recipes.push(getPreviewInformation(recipe, user_id));
  }
  return await Promise.all(recipes);
}

/**
 * This function gets a recipe id and returns the full information of the recipe
 *
 * @param {*} recipe_id  - the id of the recipe
 * @param {*} user_id - the id of the user
 *
 */
async function getUserRecipeInfo(recipe_id, user_id) {
  let favorite = await DButils.execQuery(
    `select * from favorites where user_id='${user_id}' and recipe_id='${recipe_id}'`
  );
  let seen = await DButils.execQuery(
    `select * from seens where user_id='${user_id}' and recipe_id='${recipe_id}'`
  );
  favorite = favorite.length > 0;
  seen = seen.length > 0;
  return {
    favorite: favorite,
    seen: seen,
  };
}
async function getPreviewInformation(recipe, user_id) {
  let {
    id,
    title,
    readyInMinutes,
    image,
    aggregateLikes,
    vegan,
    vegetarian,
    glutenFree,
    servings,
  } = recipe;
  user_recipe_info = await getUserRecipeInfo(id, user_id);
  return {
    id: id,
    title: title,
    readyInMinutes: readyInMinutes,
    image: image,
    popularity: aggregateLikes,
    vegan: vegan,
    vegetarian: vegetarian,
    glutenFree: glutenFree,
    servings: servings,
    favorite: user_recipe_info.favorite,
    seen: user_recipe_info.seen,
  };
}

async function getRecipesInfo(recipes_id_array) {
  recipes_id_array = recipes_id_array.map((recipe) => recipe.recipe_id);
  recipes = await DButils.execQuery(
    `select * from recipes where recipe_id in (${recipes_id_array})`
  );
  return recipes;
}

exports.getRecipesPreview = getRecipesPreview;
exports.searchByName = searchByName;
exports.randomRecipes = randomRecipes;
exports.getRecipeFullDetails = getRecipeFullDetails;
exports.getRecipesInfo = getRecipesInfo;
