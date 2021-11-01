DROP SCHEMA IF EXISTS budgetBuddy CASCADE;

CREATE SCHEMA IF NOT EXISTS budgetBuddy;

CREATE TABLE IF NOT EXISTS budgetBuddy.security_question(
	security_question_id SERIAL,
    	security_question_name VARCHAR(255) NOT NULL,
	security_question_question VARCHAR(255) NOT NULL,
	PRIMARY KEY (security_question_id) 
);

CREATE TABLE IF NOT EXISTS budgetBuddy.users(
	user_id SERIAL,
	email VARCHAR(255) UNIQUE NOT NULL,
	password VARCHAR(255) NOT NULL,
	security_question_id INT,
	security_answer VARCHAR(255),	
	first_name VARCHAR(255),
	last_name VARCHAR(255),
	username VARCHAR(255) UNIQUE NOT NULL,
	phone_number VARCHAR(14) UNIQUE,
	registered DATE NOT NULL,	
	birth_date DATE NOT NULL,
	notifications BIT NOT NULL,
	PRIMARY KEY (user_id),
	CONSTRAINT fk_userssecurityquestion FOREIGN KEY(security_question_id) REFERENCES budgetBuddy.security_question(security_question_id)
);

CREATE TABLE IF NOT EXISTS budgetBuddy.avatar(
	avatar_id SERIAL,	
	avatar_level INT,
	avatar_exp INT,
	user_id INT,
	PRIMARY KEY (avatar_id),
	CONSTRAINT fk_avataruser FOREIGN KEY(user_id) REFERENCES budgetBuddy.users(user_id)	
);

CREATE TABLE IF NOT EXISTS budgetBuddy.difficulty(
	difficulty_id SERIAL,
    	difficulty_name VARCHAR(255) NOT NULL,
	difficulty_description VARCHAR(255) NOT NULL,
	PRIMARY KEY (difficulty_id) 
);

CREATE TABLE IF NOT EXISTS budgetBuddy.items(
	item_id SERIAL,
	item_name VARCHAR(255) NOT NULL,
	item_description VARCHAR(255) NOT NULL,
	item_type VARCHAR(255) NOT NULL,	
	item_link VARCHAR(255) NOT NULL,
	difficulty_id INT,
	PRIMARY KEY (item_id),
	CONSTRAINT fk_itemsdifficulty FOREIGN KEY(difficulty_id) REFERENCES budgetBuddy.difficulty(difficulty_id)
);

CREATE TABLE IF NOT EXISTS budgetBuddy.inventory(
	inventory_id SERIAL,
	equipped BIT NOT NULL,
	item_id INT,
	avatar_id INT,
	PRIMARY KEY (inventory_id),
	CONSTRAINT fk_inventoryitems FOREIGN KEY(item_id) REFERENCES budgetBuddy.items(item_id),
	CONSTRAINT fk_inventoryavatar FOREIGN KEY(avatar_id) REFERENCES budgetBuddy.avatar(avatar_id)	
);

CREATE TABLE IF NOT EXISTS budgetBuddy.challenge(
	challenge_id SERIAL,
    	challenge_name VARCHAR(255) NOT NULL,
	challenge_description VARCHAR(255) NOT NULL,
	challenge_type VARCHAR(255) NOT NULL,
	active BIT NOT NULL,	
	challenge_time_given INT,
	challenge_repeatable BIT,
	item_id INT,
	difficulty_id INT,
	PRIMARY KEY (challenge_id),
	CONSTRAINT fk_challengeitems FOREIGN KEY(item_id) REFERENCES budgetBuddy.items(item_id),
	CONSTRAINT fk_challengedifficulty FOREIGN KEY(difficulty_id) REFERENCES budgetBuddy.difficulty(difficulty_id)
);

CREATE TABLE IF NOT EXISTS budgetBuddy.challenge_inventory(
	challenge_inventory_id SERIAL,	
	challenge_start_date DATE NOT NULL,
	challenge_completion BIT NOT NULL,
	challenge_id INT,
	avatar_id INT,
	PRIMARY KEY (challenge_inventory_id),
	CONSTRAINT fk_challengeinventorychallenge FOREIGN KEY(challenge_id) REFERENCES budgetBuddy.challenge(challenge_id),
	CONSTRAINT fk_challengeinventoryavatar FOREIGN KEY(avatar_id) REFERENCES budgetBuddy.avatar(avatar_id)
);

CREATE TABLE IF NOT EXISTS budgetBuddy.receipt(
	receipt_id SERIAL,
    	receipt_amount DECIMAL(10,2) NOT NULL,
	receipt_date DATE NOT NULL,		
	reccuring INT NOT NULL,
	income BIT NOT NULL,
	user_id INT,
	PRIMARY KEY (receipt_id),
	CONSTRAINT fk_receiptusers FOREIGN KEY(user_id) REFERENCES budgetBuddy.users(user_id)
);

CREATE TABLE IF NOT EXISTS budgetBuddy.category(
	category_id SERIAL,
    	category_name VARCHAR(255) NOT NULL,
	category_description VARCHAR(255) NOT NULL,
	PRIMARY KEY (category_id)
);

CREATE TABLE IF NOT EXISTS budgetBuddy.product(
	product_id SERIAL,
    	product_name VARCHAR(255) NOT NULL,
	product_price DECIMAL(10,2) NOT NULL,
	receipt_id INT,
	category_id INT,
	PRIMARY KEY (product_id),	
	CONSTRAINT fk_productreceipt FOREIGN KEY(receipt_id) REFERENCES budgetBuddy.receipt(receipt_id),
	CONSTRAINT fk_productcategory FOREIGN KEY(category_id) REFERENCES budgetBuddy.category(category_id)
);

CREATE TABLE IF NOT EXISTS budgetBuddy.income(
	income_id SERIAL,
	income_name VARCHAR(255) NOT NULL,
    	income_amount DECIMAL(10,2) NOT NULL,
	receipt_id INT,
	category_id INT,
	PRIMARY KEY (income_id),
	CONSTRAINT fk_productreceipt FOREIGN KEY(receipt_id) REFERENCES budgetBuddy.receipt(receipt_id),
	CONSTRAINT fk_productcategory FOREIGN KEY(category_id) REFERENCES budgetBuddy.category(category_id)		
);

CREATE TABLE IF NOT EXISTS budgetBuddy.budget(
	budget_id SERIAL,	
	projected_income DECIMAL(10,2),
	projected_expenses DECIMAL(10,2),
	additional_expenses_goal DECIMAL(10,2),
	savings_goal DECIMAL(10,2),
	savings_actual DECIMAL(10,2),
	expenses_actual DECIMAL(10,2),
	budget_percent_goal DECIMAL(10,2),
	start_date DATE,
	user_id INT,
	PRIMARY KEY (budget_id),
	CONSTRAINT fk_budgetusers FOREIGN KEY(user_id) REFERENCES budgetBuddy.users(user_id)	
);

CREATE TABLE IF NOT EXISTS budgetBuddy.notifications(
	notification_id SERIAL,
    	notification_name VARCHAR(255) NOT NULL,
	notification_message VARCHAR(255) NOT NULL,
	PRIMARY KEY (notification_id)
);

CREATE TABLE IF NOT EXISTS budgetBuddy.notifications_list(
	notification_list_id SERIAL,    		
	notification_time TIMESTAMP,
	user_id INT,
	notification_id INT,
	PRIMARY KEY (notification_list_id),
	CONSTRAINT fk_notificationslistusers FOREIGN KEY(user_id) REFERENCES budgetBuddy.users(user_id),
	CONSTRAINT fk_notificationslistnotifications FOREIGN KEY(notification_id) REFERENCES budgetBuddy.notifications(notification_id)
);

CREATE TABLE IF NOT EXISTS budgetBuddy.widget(
	widget_id SERIAL,
   	widget_name VARCHAR(255) NOT NULL,
	widget_description VARCHAR(255) NOT NULL, 
	widget_link VARCHAR(255) NOT NULL,
	PRIMARY KEY (widget_id)
);

CREATE TABLE IF NOT EXISTS budgetBuddy.widget_inventory(
	widget_inventory_id SERIAL,
	widget_position INT,
	widget_id INT,
	user_id INT,
	PRIMARY KEY (widget_inventory_id),
	CONSTRAINT fk_widgetinventorywidget FOREIGN KEY(widget_id) REFERENCES budgetBuddy.widget(widget_id),
	CONSTRAINT fk_widgetinventoryusers FOREIGN KEY(user_id) REFERENCES budgetBuddy.users(user_id)
);

CREATE TABLE IF NOT EXISTS budgetBuddy.friend_status(
	friend_status_id SERIAL,
	friend_status_type VARCHAR(20) NOT NULL,
	PRIMARY KEY (friend_status_id)
);

CREATE TABLE IF NOT EXISTS budgetBuddy.friends(
	friend_id SERIAL,	
	user_2_id INT NOT NULL,
	user_id INT,
	friend_status_id INT,	
	PRIMARY KEY (friend_status_id),
	CONSTRAINT fk_friendsusers FOREIGN KEY(user_id) REFERENCES budgetBuddy.users(user_id),
	CONSTRAINT fk_friendsfriendstatus FOREIGN KEY(friend_status_id) REFERENCES budgetBuddy.friend_status(friend_status_id),
	CONSTRAINT uq_friendsonce UNIQUE(user_id, user_2_id)
);

CREATE TABLE IF NOT EXISTS budgetBuddy.competition_status(
	competition_status_id SERIAL,
	competition_status_type VARCHAR(20) NOT NULL,
	PRIMARY KEY (competition_status_id)
);

CREATE TABLE IF NOT EXISTS budgetBuddy.competitions(
	competition_id SERIAL,
	competition_type VARCHAR (255),	
	user_2_id INT NOT NULL,
	competition_start_date DATE NOT NULL,	
	competition_winner INT,	
	user_id INT,
	competition_status_id INT,
	PRIMARY KEY (competition_id),
	CONSTRAINT fk_competitionsusers FOREIGN KEY(user_id) REFERENCES budgetBuddy.users(user_id),
	CONSTRAINT fk_competitionscompetitionstatus FOREIGN KEY(competition_status_id) REFERENCES budgetBuddy.competition_status(competition_status_id),
	CONSTRAINT uq_competitionsonce UNIQUE(user_id, user_2_id)
);

CREATE TABLE IF NOT EXISTS budgetBuddy.global_competitions(
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
