var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipes_utils = require("./utils/recipes_utils");
const family_utils = require("./utils/family_utils");

router.get("/", (req, res) => res.send("im here"));

router.get("/search", async (req, res, next) => {
  try {
    const familys = await family_utils.searchFamily(req.query.family_name);
    if (familys.length == 0) {
      throw { status: 404, message: "There are no familis with this name" };
    }

    res.send(familys);
  } catch (error) {
    next(error);
  }
});

router.get("/recipes", async (req, res, next) => {
  try {
    //TODO: check if the user is a member of the family!
    const family_id = req.query.family_id;
    const recipe_ids = await family_utils.getFamilyRecipes(family_id);
    if (recipe_ids.length == 0) {
      throw { status: 404, message: "There are no recipes in this family" };
    }
    const recipes = await recipes_utils.getRecipesInfo(recipe_ids);
    res.send(recipes);
  } catch (error) {
    next(error);
  }
});
router.get("/members", async (req, res, next) => {
  try {
    const family_id = req.query.family_id;
    const members_ids = await family_utils.getFamilyMembers(family_id);
    if (members_ids.length == 0) {
      throw { status: 404, message: "There are no members in this family" };
    }
    const members = await family_utils.getFamilyMembersInfo(members_ids);
    res.send(members);
  } catch (error) {
    next(error);
  }
});

router.post("/add", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const family_id = req.body.family_id;
    const isAdd = req.body.isAdd;
    await family_utils.addFamilyMember(user_id, family_id, isAdd);
    res.status(201).send("The user was added successfully to the family");
  } catch (error) {
    next(error);
  }
});

router.post("/create", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const family_name = req.body.family_name;
    family_id = await family_utils.addFamily(family_name);
    await family_utils.addFamilyMember(user_id, family_id, true);
    res.status(201).send("The family was created successfully");
  } catch (error) {
    next(error);
  }
});
router.get("/myFamilis", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const family_ids = await family_utils.getMyFamilis(user_id);
    if (family_ids.length == 0) {
      throw { status: 404, message: "There are no familis with this name" };
    }
    const family = await family_utils.getFamilisName(family_ids);
    res.send(family);
  } catch (error) {
    next(error);
  }
});
router.post("/addrecipe", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const family_id = req.body.family_id;
    const recipe_id = req.body.recipe_id;
    const data = req.body.data;
    const isAdd = req.body.isAdd;
    family_id, recipe_id, data, isAdd;
    check = await DButils.execQuery(
      `select * from recipes where recipe_id = '${recipe_id}'and user_id = '${user_id}'`
    );
    if (check.length == 0) {
      throw { status: 404, message: "not find recipe" };
    }
    //TODO: check if the user is a member of the family!
    await family_utils.createFamilyRecipe(family_id, recipe_id, data, isAdd);
  } catch (error) {
    next(error);
  }
});

router.get("/recipe", async (req, res, next) => {
  try {
    let user_id = req.session.user_id;
    let recipe_id = req.query.recipe_id;
    let family_id = req.query.family_id;
    let result = await DButils.execQuery(
      `select * from family_recipes where recipe_id = '${recipe_id}'and family_id = '${family_id}'`
    );
    assert(result.length > 0, "The recipe does not exist");
    result = await DButils.execQuery(
      `select * from user_family where user_id = '${user_id}'and family_id = '${family_id}'`
    );
    assert(result.length > 0, "The recipe does not exist");
    let recipe = user_utils.getRecipe(recipe_id);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
