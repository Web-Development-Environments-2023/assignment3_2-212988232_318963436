const DButils = require("./DButils");




async function favorite(user_id, recipe_id, isfav) {
  if (isfav) {
  await DButils.execQuery(
    `insert into favorites values ('${user_id}',${recipe_id},CURDATE())`
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
  let { name, imageURL, readyInMinutes, vegiterian,vegan, glutenfree } =
    recipe.previewDetails;

  let query = `INSERT INTO recipes (name, imageURL, readyInMinutes, vegiterian, vegan, glutenfree, recipe_date, user_id)
             VALUES ('${name}', '${imageURL}', '${readyInMinutes}', ${vegiterian}, ${vegan}, ${glutenfree}, CURDATE(), '${user_id}');`;
        
  let result = await DButils.execQuery(query);  
  let recipe_id = result.insertId;


  let steps = recipe.steps;
  let ingredients = recipe.ingredients;

    
  for (step in steps){
    await DButils.execQuery(
      `INSERT INTO steps (recipe_id, step_number, description) values (${recipe_id}','${step[step_number]}','${steps[description]}')`
    );
  }
  for (ingredient in ingredients){
    try{
      await DButils.execQuery(
        `INSERT INTO ingredients (ingredient_id,name, imageURL) values (${ingredient[ingredient_id]}',${ingredient[name]}','${ingredient[imageURL]}')`
      );
    }
    catch{
      //ingredient already exists
    }

    await DButils.execQuery(
      `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, units) values (${recipe_id}','${ingredient[ingredient_id]}','${ingredient[amount]}','${ingredient[units]}')`
    );
  }
  //TODO: add ingredients and instructions
}

async function setseen(user_id, recipe_id) {
  try{
    await DButils.execQuery(
      `insert into seens values ('${user_id}',${recipe_id},CURRENT_TIMESTAMP())`
    )
  }
  catch{
    await DButils.execQuery(
      `update seens set date=CURRENT_TIMESTAMP() where user_id='${user_id}' and recipe_id=${recipe_id}`
    )
  }

}


exports.favorite = favorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getMyRecipes = getMyRecipes;
exports.createRecipe = createRecipe;
exports.setseen = setseen;

