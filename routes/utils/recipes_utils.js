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

async function getRecipeDetails(recipe_id, user_id) {
  let recipe_info = await getRecipeInformation(recipe_id);
  return getInformation(recipe_info.data, user_id);
}
async function getRecipesPreview(recipes_id_array, user_id) {
  let promises = [];
  recipes_id_array.map((recipe_id) =>
    promises.push(getRecipeDetails(recipe_id, user_id))
  );
  let recipes_info = await Promise.all(promises);
  return recipes_info;
}

async function searchByName(query, user_id) {
  let { name, cuisine, diet, intolerances, number } = query;
  number = number || 5;
  console.log(name, cuisine, diet, intolerances, number);
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

  console.log(recipes);
  for (let recipe of recipes) {
    results.push(getInformation(recipe, user_id));
  }
  return await Promise.all(results);
}

async function randomRecipes(query) {
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
    recipes.push(getInformation(recipe));
  }
  return await Promise.all(recipes);
}
async function getUserRecipeInfo(recipe_id, user_id) {
  let favorite = await DButils.execQuery(
    `select * from favorites where user_id='${user_id}' and recipe_id='${recipe_id}'`
  );
  let like = await DButils.execQuery(
    `select * from likes where user_id='${user_id}' and recipe_id='${recipe_id}'`
  );
  let seen = await DButils.execQuery(
    `select * from seens where user_id='${user_id}' and recipe_id='${recipe_id}'`
  );
  favorite = favorite.length > 0;
  like = like.length > 0;
  seen = seen.length > 0;
  return {
    favorite: favorite,
    like: like,
    seen: seen,
  };
}
async function getInformation(recipe, user_id) {
  let {
    id,
    title,
    readyInMinutes,
    image,
    aggregateLikes,
    vegan,
    vegetarian,
    glutenFree,
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
    favorite: user_recipe_info.favorite,
    like: user_recipe_info.like,
    seen: user_recipe_info.seen,
  };
}
exports.getRecipeDetails = getRecipeDetails;
exports.getRecipesPreview = getRecipesPreview;
exports.searchByName = searchByName;
exports.randomRecipes = randomRecipes;
