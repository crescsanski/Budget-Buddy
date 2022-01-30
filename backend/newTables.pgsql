DROP SCHEMA IF EXISTS budgetBuddy CASCADE;
CREATE SCHEMA IF NOT EXISTS budgetBuddy;

CREATE TABLE IF NOT EXISTS budgetBuddy.security_question(
	security_question_id SERIAL,
    	security_question_name VARCHAR(255) NOT NULL,
	security_question_question VARCHAR(255) NOT NULL,
	PRIMARY KEY (security_question_id) 
);
CREATE TABLE IF NOT EXISTS budgetBuddy.experience(
	experience_id SERIAL,	
	experience_level INT NOT NULL,
	experience__title VARCHAR(255) NOT NULL,
	experience_point_threshold INT NOT NULL,	
	PRIMARY KEY (experience_id)
);
CREATE TABLE IF NOT EXISTS budgetBuddy.users(
	user_id SERIAL,
	user_first_name VARCHAR(255),
	user_last_name VARCHAR(255),
	user_user_name VARCHAR(255) UNIQUE NOT NULL,
	user_email VARCHAR(255) UNIQUE NOT NULL,
	user_password VARCHAR(255) NOT NULL,	
	user_phone_number VARCHAR(14) UNIQUE,
	user_registration_date DATE NOT NULL,	
	user_birth_date DATE NOT NULL,
	user_has_notifications BOOLEAN NOT NULL,	
	user_budget_goal_amount INT,
	user_experience_points INT,
	experience_id INT,
	security_question_id INT,
	user_security_question_answer VARCHAR(255) NOT NULL,	
	PRIMARY KEY (user_id),
	CONSTRAINT fk_userssecurityquestion FOREIGN KEY(security_question_id) REFERENCES budgetBuddy.security_question(security_question_id),
	CONSTRAINT fk_usersexperienceid FOREIGN KEY(experience_id) REFERENCES budgetBuddy.experience(experience_id)
);
CREATE TABLE IF NOT EXISTS budgetBuddy.authtoken_token(
	key VARCHAR(40) NOT NULL,
    created TIMESTAMP NOT NULL,
	user_id INT NOT NULL,
	PRIMARY KEY (key),
	CONSTRAINT fk_tokenusers FOREIGN KEY(user_id) REFERENCES budgetBuddy.users(user_id)
);
CREATE TABLE IF NOT EXISTS budgetBuddy.difficulty(
	difficulty_id SERIAL,
    	difficulty_name VARCHAR(255) NOT NULL,
	difficulty_description VARCHAR(255) NOT NULL,
	PRIMARY KEY (difficulty_id) 
);
CREATE TABLE IF NOT EXISTS budgetBuddy.item(
	item_id SERIAL,
	item_name VARCHAR(255) NOT NULL,
	item_description VARCHAR(255) NOT NULL,
	item_type VARCHAR(255) NOT NULL,	
	item_link VARCHAR(255) NOT NULL,
	difficulty_id INT,
	experience_id INT,		
	PRIMARY KEY (item_id),
	CONSTRAINT fk_itemsdifficulty FOREIGN KEY(difficulty_id) REFERENCES budgetBuddy.difficulty(difficulty_id),
	CONSTRAINT fk_itemexperience FOREIGN KEY(experience_id) REFERENCES budgetBuddy.experience(experience_id)
);
CREATE TABLE IF NOT EXISTS budgetBuddy.user_item_inventory(
	user_item_inventory_id SERIAL,
	user_item_is_equipped BOOLEAN NOT NULL,
	item_id INT NOT NULL,
	user_id INT NOT NULL,
	PRIMARY KEY (user_item_inventory_id),
	CONSTRAINT fk_useriteminventoryitem FOREIGN KEY(item_id) REFERENCES budgetBuddy.item(item_id),
	CONSTRAINT fk_useriteminventoryuser FOREIGN KEY(user_id) REFERENCES budgetBuddy.users(user_id)	
);
CREATE TABLE IF NOT EXISTS budgetBuddy.challenge_trigger(
	challenge_trigger_id SERIAL,
	challenge_trigger_name VARCHAR(255) NOT NULL,    	
	PRIMARY KEY (challenge_trigger_id) 
);
CREATE TABLE IF NOT EXISTS budgetBuddy.challenge(
	challenge_id SERIAL,
    	challenge_name VARCHAR(255) NOT NULL,
	challenge_description VARCHAR(255) NOT NULL,
	challenge_type VARCHAR(255) NOT NULL,		
	challenge_time_given INT NOT NULL,
	challenge_is_repeatable BOOLEAN NOT NULL,
	challenge_is_active BOOLEAN NOT NULL,
	challenge_experience_points INT,
	challenge_start_ammount INT,
	challenge_completion_ammount INT,		
	item_id INT,	
	difficulty_id INT,
	trigger_id INT,
	experience_id INT,	
	PRIMARY KEY (challenge_id),
	CONSTRAINT fk_challengeitem FOREIGN KEY(item_id) REFERENCES budgetBuddy.item(item_id),
	CONSTRAINT fk_challengedifficulty FOREIGN KEY(difficulty_id) REFERENCES budgetBuddy.difficulty(difficulty_id),
	CONSTRAINT fk_challengechallengetrigger FOREIGN KEY(trigger_id) REFERENCES budgetBuddy.challenge_trigger(challenge_trigger_id)
	--CONSTRAINT fk_challengeexperience FOREIGN KEY(level_id) REFERENCES budgetBuddy.levels(level_id)
);
CREATE TABLE IF NOT EXISTS budgetBuddy.user_challenge_inventory(
	user_challenge_inventory_id SERIAL,	
	user_challenge_start_date DATE NOT NULL,
	user_challenge_completion_date TIMESTAMP,
	user_challenge_current_amount INT,
	challenge_id INT,	
	user_id INT,
	PRIMARY KEY (user_challenge_inventory_id),
	CONSTRAINT fk_userchallengeinventorychallenge FOREIGN KEY(challenge_id) REFERENCES budgetBuddy.challenge(challenge_id),
	CONSTRAINT fk_userchallengeinventoryuser FOREIGN KEY(user_id) REFERENCES budgetBuddy.users(user_id)
);

CREATE TABLE IF NOT EXISTS budgetBuddy.receipt(
	receipt_id SERIAL,
    	receipt_amount DECIMAL(10,2),
	receipt_date TIMESTAMP NOT NULL,		
	receipt_is_reccuring INT NOT NULL,
	receipt_is_income BOOLEAN NOT NULL,
	user_id INT,
	PRIMARY KEY (receipt_id),
	CONSTRAINT fk_receiptusers FOREIGN KEY(user_id) REFERENCES budgetBuddy.users(user_id)
);
CREATE TABLE IF NOT EXISTS budgetBuddy.category(
	category_id SERIAL,
    	category_name VARCHAR(255) NOT NULL,	
	category_description VARCHAR(255) NOT NULL,
	category_is_income BOOLEAN NOT NULL,
	PRIMARY KEY (category_id)
);
CREATE TABLE IF NOT EXISTS budgetBuddy.expense(
	expense_id SERIAL,
    	expense_name VARCHAR(255) NOT NULL,
	expense_price DECIMAL(10,2) NOT NULL,
	expense_is_essential BOOLEAN,
	receipt_id INT,
	category_id INT,	
	PRIMARY KEY (expense_id),	
	CONSTRAINT fk_expensereceipt FOREIGN KEY(receipt_id) REFERENCES budgetBuddy.receipt(receipt_id),
	CONSTRAINT fk_expensecategory FOREIGN KEY(category_id) REFERENCES budgetBuddy.category(category_id)
);
CREATE TABLE IF NOT EXISTS budgetBuddy.income(
	income_id SERIAL,
	income_name VARCHAR(255) NOT NULL,
    	income_amount DECIMAL(10,2) NOT NULL,
	receipt_id INT,
	category_id INT,
	PRIMARY KEY (income_id),
	CONSTRAINT fk_incomereceipt FOREIGN KEY(receipt_id) REFERENCES budgetBuddy.receipt(receipt_id),
	CONSTRAINT fk_incomecategory FOREIGN KEY(category_id) REFERENCES budgetBuddy.category(category_id)		
);
CREATE TABLE IF NOT EXISTS budgetBuddy.user_category_budget(
	user_category_budget_id SERIAL,
	user_category_budget_estimated_amount INT,
	user_category_budget_last_modified_date TIMESTAMP,
	user_id INT,	
	category_id INT,		
	PRIMARY KEY (user_category_budget_id),		
	CONSTRAINT fk_usercategorybudgetuser FOREIGN KEY(user_id) REFERENCES budgetBuddy.users(user_id),
	CONSTRAINT fk_usercategorybudgetcategory FOREIGN KEY(category_id) REFERENCES budgetBuddy.category(category_id)		
);
CREATE TABLE IF NOT EXISTS budgetBuddy.notification(
	notification_id SERIAL,
    	notification_name VARCHAR(255) NOT NULL,
	notification_message VARCHAR(255) NOT NULL,
	PRIMARY KEY (notification_id)
);
CREATE TABLE IF NOT EXISTS budgetBuddy.user_notification_list(
	user_notification_list_id SERIAL,    		
	user_notification_list_time TIMESTAMP,
	user_id INT,
	notification_id INT,
	PRIMARY KEY (user_notification_list_id),
	CONSTRAINT fk_usernotificationlistuser FOREIGN KEY(user_id) REFERENCES budgetBuddy.users(user_id),
	CONSTRAINT fk_usernotificationlistnotification FOREIGN KEY(notification_id) REFERENCES budgetBuddy.notification(notification_id)
);
CREATE TABLE IF NOT EXISTS budgetBuddy.widget(
	widget_id SERIAL,
   	widget_name VARCHAR(255) NOT NULL,
	widget_description VARCHAR(255) NOT NULL, 
	widget_link VARCHAR(255) NOT NULL,
	PRIMARY KEY (widget_id)
);
CREATE TABLE IF NOT EXISTS budgetBuddy.user_widget_inventory(
	user_widget_inventory_id SERIAL,
	user_widget_position INT,
	widget_id INT,
	user_id INT,
	PRIMARY KEY (user_widget_inventory_id),
	CONSTRAINT fk_widgetinventorywidget FOREIGN KEY(widget_id) REFERENCES budgetBuddy.widget(widget_id),
	CONSTRAINT fk_widgetinventoryusers FOREIGN KEY(user_id) REFERENCES budgetBuddy.users(user_id)
);
CREATE TABLE IF NOT EXISTS budgetBuddy.friend(
	friend_id SERIAL,	
	user_2_id INT NOT NULL,
	user_id INT,
	friend_status_type VARCHAR(20) NOT NULL,	
	PRIMARY KEY (friend_id),
	CONSTRAINT fk_frienduser FOREIGN KEY(user_id) REFERENCES budgetBuddy.users(user_id),
	CONSTRAINT uq_friendsonce UNIQUE(user_id, user_2_id)
);
CREATE TABLE IF NOT EXISTS budgetBuddy.competition(
	competition_id SERIAL,
	competition_type VARCHAR (255),	
	user_2_id INT NOT NULL,
	competition_status_type VARCHAR(20) NOT NULL,
	competition_start_date DATE NOT NULL,	
	competition_winner INT,	
	user_id INT,	
	PRIMARY KEY (competition_id),
	CONSTRAINT fk_competitionsusers FOREIGN KEY(user_id) REFERENCES budgetBuddy.users(user_id),
	CONSTRAINT uq_competitionsonce UNIQUE(user_id, user_2_id)
);
CREATE TABLE IF NOT EXISTS budgetBuddy.global_competition(
	global_competition_id SERIAL,
	global_competition_type VARCHAR(255),	
	budget_percent_goal DECIMAL(10,2),
	ranking INT NOT NULL,
	competition_start_date DATE NOT NULL,
	competition_winner INT,
	user_id INT,
	PRIMARY KEY (global_competition_id),
	CONSTRAINT fk_globalcompetitionsusers FOREIGN KEY(user_id) REFERENCES budgetBuddy.users(user_id)
);