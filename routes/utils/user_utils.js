const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id) {
  await DButils.execQuery(
    `insert into favorites values ('${user_id}',${recipe_id},CURDATE())`
  );
}
async function unmarkAsFavorite(user_id, recipe_id) {
  await DButils.execQuery(
    `delete from favorites where user_id='${user_id}' and recipe_id=${recipe_id}`
  );
}

async function markAsSeen(user_id, recipe_id) {
  await DButils.execQuery(
    `insert into seens values ('${user_id}',${recipe_id},CURDATE())`
  );
}

async function markAsLike(user_id, recipe_id) {
  await DButils.execQuery(
    `insert into likes values ('${user_id}',${recipe_id},CURDATE())`
  );
}
async function unmarkAsLike(user_id, recipe_id) {
  await DButils.execQuery(
    `delete from likes where user_id='${user_id}' and recipe_id=${recipe_id}`
  );
}

async function getFavoriteRecipes(user_id) {
  const recipes_id = await DButils.execQuery(
    `select recipe_id from favorites where user_id='${user_id}'`
  );
  return recipes_id;
}

async function createNewRecipe(user_id, recipe) {
  let { name, image, readyInMinutes, vegetarianlevel, glutenfree } =
    recipe.previewDetails;

  await DButils.execQuery(
    `INSERT INTO recipes (name, image, readyInMinutes, vegetarianlevel, glutenfree, recipe_date, user_id) values (${name}','${image}','${readyInMinutes}','${vegetarianlevel}','${glutenfree}',CURDATE(),'${user_id}')`
  );
  //TODO: add ingredients and instructions
}

exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.unmarkAsFavorite = unmarkAsFavorite;
exports.markAsSeen = markAsSeen;
exports.markAsLike = markAsLike;
exports.unmarkAsLike = unmarkAsLike;
exports.createNewRecipe = createNewRecipe;
