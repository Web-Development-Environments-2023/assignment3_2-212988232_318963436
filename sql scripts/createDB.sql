DROP DATABASE IF EXISTS recipe_db;

CREATE DATABASE recipe_db;

USE recipe_db;

CREATE TABLE
    users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE,
        password VARCHAR(255),
        firstname VARCHAR(100),
        lastname VARCHAR(100),
        email VARCHAR(100),
        country VARCHAR(50)
    );

CREATE TABLE
    recipes (
        recipe_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50),
        imageURL VARCHAR(255),
        readyInMinutes INTEGER,
        vegiterian BOOLEAN,
        vegan BOOLEAN,
        glutenfree BOOLEAN,
        recipe_date DATE,
        user_id INT,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

CREATE TABLE
    favorites (
        user_id INT ,
        recipe_id INT ,
        date TIMESTAMP,
        PRIMARY KEY (user_id, recipe_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

CREATE TABLE
    seens (
        user_id INT ,
        recipe_id INT ,
        date TIMESTAMP,
        PRIMARY KEY (user_id, recipe_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    );
CREATE TABLE 
    ingredients(
        ingredient_id INT PRIMARY KEY,
        name VARCHAR(50),
        imageURL VARCHAR(255)
    );
CREATE TABLE
    recipe_ingredients(
        recipe_id INT,
        ingredient_id INT,
        amount INT,
        units ENUM("g", "kg", "ml", "l", "tsp", "tbsp", "cup", "piece"),
        PRIMARY KEY (recipe_id, ingredient_id),
        FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id),
        FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id)
    );

CREATE TABLE
    steps(
        step_id INT AUTO_INCREMENT PRIMARY KEY,
        recipe_id INT,
        step_number INT,
        description VARCHAR(1000),
        FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id)
    );

CREATE TABLE
    family(
        family_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50)
    );
CREATE TABLE
    user_family(
        family_id INT,
        user_id INT,
        PRIMARY KEY (family_id, user_id),
        FOREIGN KEY (family_id) REFERENCES family(family_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    );
CREATE TABLE
    recipe_family(
        family_id INT,
        recipe_id INT,
        PRIMARY KEY (family_id, recipe_id),
        FOREIGN KEY (family_id) REFERENCES family(family_id),
        FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id)
    );





    


