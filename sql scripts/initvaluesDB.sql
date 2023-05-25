-- Inserting values into the Users table
INSERT INTO users (username, password, firstname, lastname, email, country)
VALUES ('john.doe', 'password123', 'John', 'Doe', 'john.doe@example.com', 'USA'),
       ('jane.smith', 'password456', 'Jane', 'Smith', 'jane.smith@example.com', 'Canada'),
       ('alex.brown', 'password789', 'Alex', 'Brown', 'alex.brown@example.com', 'UK'),
       ('emma.johnson', 'password987', 'Emma', 'Johnson', 'emma.johnson@example.com', 'USA'),
       ('michael.wilson', 'password654', 'Michael', 'Wilson', 'michael.wilson@example.com', 'Canada'),
       ('sophia.davis', 'password321', 'Sophia', 'Davis', 'sophia.davis@example.com', 'UK'),
       ('oliver.miller', 'password012', 'Oliver', 'Miller', 'oliver.miller@example.com', 'USA'),
       ('ava.jones', 'password345', 'Ava', 'Jones', 'ava.jones@example.com', 'Canada'),
       ('william.jackson', 'password678', 'William', 'Jackson', 'william.jackson@example.com', 'UK'),
       ('mia.anderson', 'password901', 'Mia', 'Anderson', 'mia.anderson@example.com', 'USA');

-- Inserting values into the Recipes table
INSERT INTO recipes (name, image, timetocook, vegetarianlevel, glutenfree, recipe_date, user_id)
VALUES ('Pasta Carbonara', NULL, 30, 'non vegiterian', FALSE, '2023-05-23', 1),
       ('Vegan Curry', NULL, 45, 'vegan', TRUE, '2023-05-22', 2),
       ('Grilled Chicken', NULL, 60, 'non vegiterian', TRUE, '2023-05-21', 3),
       ('Chocolate Cake', NULL, 60, 'non vegiterian', TRUE, '2023-05-20', 4),
       ('Vegetable Stir-Fry', NULL, 20, 'vegiterian', TRUE, '2023-05-19', 5),
       ('BBQ Ribs', NULL, 120, 'non vegiterian', FALSE, '2023-05-18', 6),
       ('Mushroom Risotto', NULL, 40, 'vegiterian', TRUE, '2023-05-17', 7),
       ('Tacos', NULL, 30, 'non vegiterian', TRUE, '2023-05-16', 8),
       ('Spinach Salad', NULL, 15, 'vegiterian', TRUE, '2023-05-15', 9),
       ('Beef Stroganoff', NULL, 60, 'non vegiterian', FALSE, '2023-05-14', 10);

-- Inserting values into the likes table
INSERT INTO likes (user_id, recipe_id)
VALUES (1, 2),
       (2, 1),
       (3, 1),
       (3, 2),
       (4, 3),
       (5, 1),
       (6, 2),
       (7, 1),
       (8, 3),
       (9, 2);

-- Inserting values into the favorites table
INSERT INTO favorites (user_id, recipe_id)
VALUES (1, 3),
       (2, 1),
       (2, 3),
       (3, 2),
       (4, 1),
       (5, 2),
       (6, 3),
       (7, 1),
       (8, 2),
       (9, 3);

-- Inserting values into the seens table
INSERT INTO seens (user_id, recipe_id)
VALUES (1, 2),
       (2, 1),
       (3, 1),
       (3, 3),
       (4, 2),
       (5, 1),
       (6, 3),
       (7, 2),
       (8, 1),
       (9, 3);

-- Inserting values into the ingredients table
INSERT INTO ingredients (name)
VALUES ('Pasta'),
       ('Bacon'),
       ('Eggs'),
       ('Onion'),
       ('Garlic'),
       ('Coconut Milk'),
       ('Curry Powder'),
       ('Chicken Breast'),
       ('Chocolate'),
       ('Flour');

-- Inserting values into the recipe_ingredients table
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, units)
VALUES (1, 1, 200, 'g'),
       (1, 2, 100, 'g'),
       (1, 3, 2, 'piece'),
       (1, 4, 1, 'piece'),
       (1, 5, 2, 'piece'),
       (2, 6, 400, 'ml'),
       (2, 7, 2, 'tbsp'),
       (3, 8, 500, 'g'),
       (4, 9, 200, 'g'),
       (4, 10, 250, 'g');

-- Inserting values into the steps table
INSERT INTO steps (recipe_id, step_number, description)
VALUES (1, 1, 'Cook the pasta according to package instructions.'),
       (1, 2, 'Fry the bacon until crispy, then set aside.'),
       (1, 3, 'In a bowl, whisk together eggs and grated Parmesan.'),
       (2, 1, 'In a pan, sauté onion and garlic until translucent.'),
       (2, 2, 'Add coconut milk and curry powder, simmer for 10 minutes.'),
       (3, 1, 'Grill the chicken until cooked through.'),
       (4, 1, 'Preheat the oven to 180°C. Grease and flour a cake pan.'),
       (4, 2, 'In a mixing bowl, cream together butter and sugar.'),
       (5, 1, 'Heat oil in a pan, sauté vegetables until tender.'),
       (5, 2, 'Add soy sauce and stir-fry for a few minutes.'),
       (6, 1, 'Preheat the grill. Season ribs with salt and pepper.'),
       (6, 2, 'Grill the ribs, basting with BBQ sauce.'),
       (7, 1, 'In a saucepan, cook mushrooms in butter until soft.'),
       (7, 2, 'Add rice and gradually stir in chicken broth.'),
       (8, 1, 'Cook ground beef in a pan, add taco seasoning.'),
       (8, 2, 'Serve cooked beef in taco shells with desired toppings.'),
       (9, 1, 'In a bowl, combine spinach, tomatoes, and dressing.'),
       (10, 1, 'In a pan, sauté beef until browned.'),
       (10, 2, 'Add onions and mushrooms, cook until tender.'),
       (10, 3, 'Stir in sour cream and simmer for 10 minutes.');
