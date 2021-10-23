CREATE SCHEMA IF NOT EXISTS budgetBuddy;

CREATE TABLE IF NOT EXISTS budgetBuddy.users(
    user_id SERIAL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    user_name VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(14) UNIQUE,
    registered DATE NOT NULL,
    birth_date DATE NOT NULL,
    PRIMARY KEY (user_id)
);