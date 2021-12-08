CREATE SCHEMA budgetbuddy;
CREATE TABLE budgetbuddy.auth_group (
    id integer NOT NULL,
    name character varying(150) NOT NULL
);
CREATE SEQUENCE budgetbuddy.auth_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE budgetbuddy.auth_group_id_seq OWNED BY budgetbuddy.auth_group.id;
CREATE TABLE budgetbuddy.auth_group_permissions (
    id bigint NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL
);
CREATE SEQUENCE budgetbuddy.auth_group_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE budgetbuddy.auth_group_permissions_id_seq OWNED BY budgetbuddy.auth_group_permissions.id;
CREATE TABLE budgetbuddy.auth_permission (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    content_type_id integer NOT NULL,
    codename character varying(100) NOT NULL
);
CREATE SEQUENCE budgetbuddy.auth_permission_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE budgetbuddy.auth_permission_id_seq OWNED BY budgetbuddy.auth_permission.id;
CREATE TABLE budgetbuddy.authtoken_token (
    key character varying(40) NOT NULL,
    created timestamp with time zone NOT NULL,
    user_id integer NOT NULL
);
CREATE TABLE budgetbuddy.budget (
    budget_id integer NOT NULL,
    estimated_amount integer,
    last_modified_date timestamp with time zone,
    category_id integer,
    user_id integer
);
CREATE SEQUENCE budgetbuddy.budget_budget_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE budgetbuddy.budget_budget_id_seq OWNED BY budgetbuddy.budget.budget_id;
CREATE TABLE budgetbuddy.category (
    category_id integer NOT NULL,
    category_name character varying(255) NOT NULL,
    category_description character varying(255) NOT NULL,
    category_income boolean NOT NULL
);
CREATE SEQUENCE budgetbuddy.category_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE budgetbuddy.category_category_id_seq OWNED BY budgetbuddy.category.category_id;
CREATE TABLE budgetbuddy.challenge (
    challenge_id integer NOT NULL,
    challenge_name character varying(255) NOT NULL,
    challenge_description character varying(255) NOT NULL,
    challenge_type character varying(255) NOT NULL,
    challenge_time_given integer NOT NULL,
    challenge_repeatable boolean NOT NULL,
    active boolean NOT NULL,
    experience integer,
    minimum integer,
    maximum integer,
    difficulty_id integer,
    item_id integer,
    trigger_id integer
);
CREATE SEQUENCE budgetbuddy.challenge_challenge_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE budgetbuddy.challenge_challenge_id_seq OWNED BY budgetbuddy.challenge.challenge_id;
CREATE TABLE budgetbuddy.challenge_inventory (
    challenge_inventory_id integer NOT NULL,
    challenge_start_date date NOT NULL,
    challenge_completion timestamp with time zone,
    status integer,
    challenge_id integer,
    user_id integer
);
CREATE SEQUENCE budgetbuddy.challenge_inventory_challenge_inventory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE budgetbuddy.challenge_inventory_challenge_inventory_id_seq OWNED BY budgetbuddy.challenge_inventory.challenge_inventory_id;
CREATE TABLE budgetbuddy.competition_status (
    competition_status_id integer NOT NULL,
    competition_status_type character varying(20) NOT NULL
);
CREATE SEQUENCE budgetbuddy.competition_status_competition_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE budgetbuddy.competition_status_competition_status_id_seq OWNED BY budgetbuddy.competition_status.competition_status_id;
CREATE TABLE budgetbuddy.competitions (
    competition_id integer NOT NULL,
    competition_type character varying(255),
    user_2_id integer NOT NULL,
    competition_start_date date NOT NULL,
    competition_winner integer,
    competition_status_id integer,
    user_id integer
);
CREATE SEQUENCE budgetbuddy.competitions_competition_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE budgetbuddy.competitions_competition_id_seq OWNED BY budgetbuddy.competitions.competition_id;
CREATE TABLE budgetbuddy.difficulty (
    difficulty_id integer NOT NULL,
    difficulty_name character varying(255) NOT NULL,
    difficulty_description character varying(255) NOT NULL
);
CREATE SEQUENCE budgetbuddy.difficulty_difficulty_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE budgetbuddy.difficulty_difficulty_id_seq OWNED BY budgetbuddy.difficulty.difficulty_id;
CREATE TABLE budgetbuddy.django_admin_log (
    id integer NOT NULL,
    action_time timestamp with time zone NOT NULL,
    object_id text,
    object_repr character varying(200) NOT NULL,
    action_flag smallint NOT NULL,
    change_message text NOT NULL,
    content_type_id integer,
    user_id integer NOT NULL,
    CONSTRAINT django_admin_log_action_flag_check CHECK ((action_flag >= 0))
);
CREATE SEQUENCE budgetbuddy.django_admin_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE budgetbuddy.django_admin_log_id_seq OWNED BY budgetbuddy.django_admin_log.id;
CREATE TABLE budgetbuddy.django_content_type (
    id integer NOT NULL,
    app_label character varying(100) NOT NULL,
    model character varying(100) NOT NULL
);
CREATE SEQUENCE budgetbuddy.django_content_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE budgetbuddy.django_content_type_id_seq OWNED BY budgetbuddy.django_content_type.id;
CREATE TABLE budgetbuddy.django_migrations (
    id bigint NOT NULL,
    app character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL
);
CREATE SEQUENCE budgetbuddy.django_migrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE budgetbuddy.django_migrations_id_seq OWNED BY budgetbuddy.django_migrations.id;
CREATE TABLE budgetbuddy.django_session (
    session_key character varying(40) NOT NULL,
    session_data text NOT NULL,
    expire_date timestamp with time zone NOT NULL
);
CREATE TABLE budgetbuddy.friend_status (
    friend_status_id integer NOT NULL,
    friend_status_type character varying(20) NOT NULL
);
CREATE SEQUENCE budgetbuddy.friend_status_friend_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE budgetbuddy.friend_status_friend_status_id_seq OWNED BY budgetbuddy.friend_status.friend_status_id;
CREATE TABLE budgetbuddy.friends (
    friend_id integer NOT NULL,
    user_2_id integer NOT NULL,
    friend_status_id integer,
    user_id integer
);
CREATE SEQUENCE budgetbuddy.friends_friend_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE budgetbuddy.friends_friend_id_seq OWNED BY budgetbuddy.friends.friend_id;
CREATE TABLE budgetbuddy.global_competitions (
    global_competition_id integer NOT NULL,
    global_competition_type character varying(255),
    budget_percent_goal numeric(10,2),
    ranking integer NOT NULL,
    competition_start_date date NOT NULL,
    competition_winner integer,
    user_id integer
);
CREATE SEQUENCE budgetbuddy.global_competitions_global_competition_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE budgetbuddy.global_competitions_global_competition_id_seq OWNED BY budgetbuddy.global_competitions.global_competition_id;
CREATE TABLE budgetbuddy.income (
    income_id integer NOT NULL,
    income_name character varying(255) NOT NULL,
    income_amount numeric(10,2) NOT NULL,
    category_id integer,
    receipt_id integer
);
CREATE SEQUENCE budgetbuddy.income_income_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE budgetbuddy.income_income_id_seq OWNED BY budgetbuddy.income.income_id;
CREATE TABLE budgetbuddy.inventory (
    inventory_id integer NOT NULL,
    equipped boolean NOT NULL,
    item_id integer,
    user_id integer
);
CREATE SEQUENCE budgetbuddy.inventory_inventory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE budgetbuddy.inventory_inventory_id_seq OWNED BY budgetbuddy.inventory.inventory_id;
CREATE TABLE budgetbuddy.items (
    item_id integer NOT NULL,
    item_name character varying(255) NOT NULL,
    item_description character varying(255) NOT NULL,
    item_type character varying(255) NOT NULL,
    item_link character varying(255) NOT NULL,
    unlock_level integer,
    difficulty_id integer
);
CREATE SEQUENCE budgetbuddy.items_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE budgetbuddy.items_item_id_seq OWNED BY budgetbuddy.items.item_id;
CREATE TABLE budgetbuddy.levels (
    level_id integer NOT NULL,
    level_number integer NOT NULL,
    level_exp integer NOT NULL,
    challenge_id integer,
    item_id integer
);
CREATE SEQUENCE budgetbuddy.levels_level_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE budgetbuddy.levels_level_id_seq OWNED BY budgetbuddy.levels.level_id;
CREATE TABLE budgetbuddy.notifications (
    notification_id integer NOT NULL,
    notification_name character varying(255) NOT NULL,
    notification_message character varying(255) NOT NULL
);
CREATE TABLE budgetbuddy.notifications_list (
    notification_list_id integer NOT NULL,
    notification_time timestamp with time zone,
    notification_id integer,
    user_id integer
);
CREATE SEQUENCE budgetbuddy.notifications_list_notification_list_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE budgetbuddy.notifications_list_notification_list_id_seq OWNED BY budgetbuddy.notifications_list.notification_list_id;
CREATE SEQUENCE budgetbuddy.notifications_notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE budgetbuddy.notifications_notification_id_seq OWNED BY budgetbuddy.notifications.notification_id;
CREATE TABLE budgetbuddy.product (
    product_id integer NOT NULL,
    product_name character varying(255) NOT NULL,
    product_price numeric(10,2) NOT NULL,
    essential boolean,
    category_id integer,
    receipt_id integer
);
CREATE SEQUENCE budgetbuddy.product_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE budgetbuddy.product_product_id_seq OWNED BY budgetbuddy.product.product_id;
CREATE TABLE budgetbuddy.receipt (
    receipt_id integer NOT NULL,
    receipt_amount numeric(10,2),
    receipt_date timestamp with time zone NOT NULL,
    reccuring integer NOT NULL,
    is_income boolean NOT NULL,
    user_id integer
);
CREATE SEQUENCE budgetbuddy.receipt_receipt_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE budgetbuddy.receipt_receipt_id_seq OWNED BY budgetbuddy.receipt.receipt_id;
CREATE TABLE budgetbuddy.security_question (
    security_question_id integer NOT NULL,
    security_question_name character varying(255) NOT NULL,
    security_question_question character varying(255) NOT NULL
);
CREATE SEQUENCE budgetbuddy.security_question_security_question_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE budgetbuddy.security_question_security_question_id_seq OWNED BY budgetbuddy.security_question.security_question_id;
CREATE TABLE budgetbuddy.trigger (
    trigger_id integer NOT NULL,
    trigger_names character varying(255)
);
CREATE SEQUENCE budgetbuddy.trigger_trigger_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE budgetbuddy.trigger_trigger_id_seq OWNED BY budgetbuddy.trigger.trigger_id;
CREATE TABLE budgetbuddy.user_budget_goal (
    goal_id integer NOT NULL,
    goal_amount integer,
    user_id integer
);
CREATE SEQUENCE budgetbuddy.user_budget_goal_goal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE budgetbuddy.user_budget_goal_goal_id_seq OWNED BY budgetbuddy.user_budget_goal.goal_id;
CREATE TABLE budgetbuddy.users (
    last_login timestamp with time zone,
    email character varying(255),
    user_id integer NOT NULL,
    first_name character varying(255),
    last_name character varying(255),
    username character varying(255) NOT NULL,
    phone_number character varying(14),
    password character varying(255),
    registered date,
    birth_date date,
    user_exp integer,
    security_answer character varying(255),
    notifications boolean,
    is_active boolean NOT NULL,
    is_admin boolean NOT NULL,
    security_question_id integer
);
CREATE SEQUENCE budgetbuddy.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE budgetbuddy.users_user_id_seq OWNED BY budgetbuddy.users.user_id;
CREATE TABLE budgetbuddy.widget (
    widget_id integer NOT NULL,
    widget_name character varying(255) NOT NULL,
    widget_description character varying(255) NOT NULL,
    widget_link character varying(255) NOT NULL
);
CREATE TABLE budgetbuddy.widget_inventory (
    widget_inventory_id integer NOT NULL,
    widget_position integer,
    user_id integer,
    widget_id integer
);
CREATE SEQUENCE budgetbuddy.widget_inventory_widget_inventory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE budgetbuddy.widget_inventory_widget_inventory_id_seq OWNED BY budgetbuddy.widget_inventory.widget_inventory_id;
CREATE SEQUENCE budgetbuddy.widget_widget_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE budgetbuddy.widget_widget_id_seq OWNED BY budgetbuddy.widget.widget_id;
ALTER TABLE ONLY budgetbuddy.auth_group ALTER COLUMN id SET DEFAULT nextval('budgetbuddy.auth_group_id_seq'::regclass);
ALTER TABLE ONLY budgetbuddy.auth_group_permissions ALTER COLUMN id SET DEFAULT nextval('budgetbuddy.auth_group_permissions_id_seq'::regclass);
ALTER TABLE ONLY budgetbuddy.auth_permission ALTER COLUMN id SET DEFAULT nextval('budgetbuddy.auth_permission_id_seq'::regclass);
ALTER TABLE ONLY budgetbuddy.budget ALTER COLUMN budget_id SET DEFAULT nextval('budgetbuddy.budget_budget_id_seq'::regclass);
ALTER TABLE ONLY budgetbuddy.category ALTER COLUMN category_id SET DEFAULT nextval('budgetbuddy.category_category_id_seq'::regclass);
ALTER TABLE ONLY budgetbuddy.challenge ALTER COLUMN challenge_id SET DEFAULT nextval('budgetbuddy.challenge_challenge_id_seq'::regclass);
ALTER TABLE ONLY budgetbuddy.challenge_inventory ALTER COLUMN challenge_inventory_id SET DEFAULT nextval('budgetbuddy.challenge_inventory_challenge_inventory_id_seq'::regclass);
ALTER TABLE ONLY budgetbuddy.competition_status ALTER COLUMN competition_status_id SET DEFAULT nextval('budgetbuddy.competition_status_competition_status_id_seq'::regclass);
ALTER TABLE ONLY budgetbuddy.competitions ALTER COLUMN competition_id SET DEFAULT nextval('budgetbuddy.competitions_competition_id_seq'::regclass);
ALTER TABLE ONLY budgetbuddy.difficulty ALTER COLUMN difficulty_id SET DEFAULT nextval('budgetbuddy.difficulty_difficulty_id_seq'::regclass);
ALTER TABLE ONLY budgetbuddy.django_admin_log ALTER COLUMN id SET DEFAULT nextval('budgetbuddy.django_admin_log_id_seq'::regclass);
ALTER TABLE ONLY budgetbuddy.django_content_type ALTER COLUMN id SET DEFAULT nextval('budgetbuddy.django_content_type_id_seq'::regclass);
ALTER TABLE ONLY budgetbuddy.django_migrations ALTER COLUMN id SET DEFAULT nextval('budgetbuddy.django_migrations_id_seq'::regclass);
ALTER TABLE ONLY budgetbuddy.friend_status ALTER COLUMN friend_status_id SET DEFAULT nextval('budgetbuddy.friend_status_friend_status_id_seq'::regclass);
ALTER TABLE ONLY budgetbuddy.friends ALTER COLUMN friend_id SET DEFAULT nextval('budgetbuddy.friends_friend_id_seq'::regclass);
ALTER TABLE ONLY budgetbuddy.global_competitions ALTER COLUMN global_competition_id SET DEFAULT nextval('budgetbuddy.global_competitions_global_competition_id_seq'::regclass);
ALTER TABLE ONLY budgetbuddy.income ALTER COLUMN income_id SET DEFAULT nextval('budgetbuddy.income_income_id_seq'::regclass);
ALTER TABLE ONLY budgetbuddy.inventory ALTER COLUMN inventory_id SET DEFAULT nextval('budgetbuddy.inventory_inventory_id_seq'::regclass);
ALTER TABLE ONLY budgetbuddy.items ALTER COLUMN item_id SET DEFAULT nextval('budgetbuddy.items_item_id_seq'::regclass);
ALTER TABLE ONLY budgetbuddy.levels ALTER COLUMN level_id SET DEFAULT nextval('budgetbuddy.levels_level_id_seq'::regclass);
ALTER TABLE ONLY budgetbuddy.notifications ALTER COLUMN notification_id SET DEFAULT nextval('budgetbuddy.notifications_notification_id_seq'::regclass);
ALTER TABLE ONLY budgetbuddy.notifications_list ALTER COLUMN notification_list_id SET DEFAULT nextval('budgetbuddy.notifications_list_notification_list_id_seq'::regclass);
ALTER TABLE ONLY budgetbuddy.product ALTER COLUMN product_id SET DEFAULT nextval('budgetbuddy.product_product_id_seq'::regclass);
ALTER TABLE ONLY budgetbuddy.receipt ALTER COLUMN receipt_id SET DEFAULT nextval('budgetbuddy.receipt_receipt_id_seq'::regclass);
ALTER TABLE ONLY budgetbuddy.security_question ALTER COLUMN security_question_id SET DEFAULT nextval('budgetbuddy.security_question_security_question_id_seq'::regclass);
ALTER TABLE ONLY budgetbuddy.trigger ALTER COLUMN trigger_id SET DEFAULT nextval('budgetbuddy.trigger_trigger_id_seq'::regclass);
ALTER TABLE ONLY budgetbuddy.user_budget_goal ALTER COLUMN goal_id SET DEFAULT nextval('budgetbuddy.user_budget_goal_goal_id_seq'::regclass);
ALTER TABLE ONLY budgetbuddy.users ALTER COLUMN user_id SET DEFAULT nextval('budgetbuddy.users_user_id_seq'::regclass);
ALTER TABLE ONLY budgetbuddy.widget ALTER COLUMN widget_id SET DEFAULT nextval('budgetbuddy.widget_widget_id_seq'::regclass);
ALTER TABLE ONLY budgetbuddy.widget_inventory ALTER COLUMN widget_inventory_id SET DEFAULT nextval('budgetbuddy.widget_inventory_widget_inventory_id_seq'::regclass);
ALTER TABLE ONLY budgetbuddy.auth_group
    ADD CONSTRAINT auth_group_name_key UNIQUE (name);
ALTER TABLE ONLY budgetbuddy.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_permission_id_0cd325b0_uniq UNIQUE (group_id, permission_id);
ALTER TABLE ONLY budgetbuddy.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY budgetbuddy.auth_group
    ADD CONSTRAINT auth_group_pkey PRIMARY KEY (id);
ALTER TABLE ONLY budgetbuddy.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_codename_01ab375a_uniq UNIQUE (content_type_id, codename);
ALTER TABLE ONLY budgetbuddy.auth_permission
    ADD CONSTRAINT auth_permission_pkey PRIMARY KEY (id);
ALTER TABLE ONLY budgetbuddy.authtoken_token
    ADD CONSTRAINT authtoken_token_pkey PRIMARY KEY (key);
ALTER TABLE ONLY budgetbuddy.authtoken_token
    ADD CONSTRAINT authtoken_token_user_id_key UNIQUE (user_id);
ALTER TABLE ONLY budgetbuddy.budget
    ADD CONSTRAINT budget_pkey PRIMARY KEY (budget_id);
ALTER TABLE ONLY budgetbuddy.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (category_id);
ALTER TABLE ONLY budgetbuddy.challenge_inventory
    ADD CONSTRAINT challenge_inventory_pkey PRIMARY KEY (challenge_inventory_id);
ALTER TABLE ONLY budgetbuddy.challenge
    ADD CONSTRAINT challenge_pkey PRIMARY KEY (challenge_id);
ALTER TABLE ONLY budgetbuddy.competition_status
    ADD CONSTRAINT competition_status_pkey PRIMARY KEY (competition_status_id);
ALTER TABLE ONLY budgetbuddy.competitions
    ADD CONSTRAINT competitions_pkey PRIMARY KEY (competition_id);
ALTER TABLE ONLY budgetbuddy.competitions
    ADD CONSTRAINT competitions_user_id_user_2_id_2bc82f24_uniq UNIQUE (user_id, user_2_id);
ALTER TABLE ONLY budgetbuddy.difficulty
    ADD CONSTRAINT difficulty_pkey PRIMARY KEY (difficulty_id);
ALTER TABLE ONLY budgetbuddy.django_admin_log
    ADD CONSTRAINT django_admin_log_pkey PRIMARY KEY (id);
ALTER TABLE ONLY budgetbuddy.django_content_type
    ADD CONSTRAINT django_content_type_app_label_model_76bd3d3b_uniq UNIQUE (app_label, model);
ALTER TABLE ONLY budgetbuddy.django_content_type
    ADD CONSTRAINT django_content_type_pkey PRIMARY KEY (id);
ALTER TABLE ONLY budgetbuddy.django_migrations
    ADD CONSTRAINT django_migrations_pkey PRIMARY KEY (id);
ALTER TABLE ONLY budgetbuddy.django_session
    ADD CONSTRAINT django_session_pkey PRIMARY KEY (session_key);
ALTER TABLE ONLY budgetbuddy.friend_status
    ADD CONSTRAINT friend_status_pkey PRIMARY KEY (friend_status_id);
ALTER TABLE ONLY budgetbuddy.friends
    ADD CONSTRAINT friends_pkey PRIMARY KEY (friend_id);
ALTER TABLE ONLY budgetbuddy.friends
    ADD CONSTRAINT friends_user_id_user_2_id_dee519b2_uniq UNIQUE (user_id, user_2_id);
ALTER TABLE ONLY budgetbuddy.global_competitions
    ADD CONSTRAINT global_competitions_pkey PRIMARY KEY (global_competition_id);
ALTER TABLE ONLY budgetbuddy.income
    ADD CONSTRAINT income_pkey PRIMARY KEY (income_id);
ALTER TABLE ONLY budgetbuddy.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (inventory_id);
ALTER TABLE ONLY budgetbuddy.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (item_id);
ALTER TABLE ONLY budgetbuddy.levels
    ADD CONSTRAINT levels_pkey PRIMARY KEY (level_id);
ALTER TABLE ONLY budgetbuddy.notifications_list
    ADD CONSTRAINT notifications_list_pkey PRIMARY KEY (notification_list_id);
ALTER TABLE ONLY budgetbuddy.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (notification_id);
ALTER TABLE ONLY budgetbuddy.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (product_id);
ALTER TABLE ONLY budgetbuddy.receipt
    ADD CONSTRAINT receipt_pkey PRIMARY KEY (receipt_id);
ALTER TABLE ONLY budgetbuddy.security_question
    ADD CONSTRAINT security_question_pkey PRIMARY KEY (security_question_id);
ALTER TABLE ONLY budgetbuddy.trigger
    ADD CONSTRAINT trigger_pkey PRIMARY KEY (trigger_id);
ALTER TABLE ONLY budgetbuddy.user_budget_goal
    ADD CONSTRAINT user_budget_goal_pkey PRIMARY KEY (goal_id);
ALTER TABLE ONLY budgetbuddy.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
ALTER TABLE ONLY budgetbuddy.users
    ADD CONSTRAINT users_password_key UNIQUE (password);
ALTER TABLE ONLY budgetbuddy.users
    ADD CONSTRAINT users_phone_number_key UNIQUE (phone_number);
ALTER TABLE ONLY budgetbuddy.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);
ALTER TABLE ONLY budgetbuddy.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
ALTER TABLE ONLY budgetbuddy.widget_inventory
    ADD CONSTRAINT widget_inventory_pkey PRIMARY KEY (widget_inventory_id);
ALTER TABLE ONLY budgetbuddy.widget
    ADD CONSTRAINT widget_pkey PRIMARY KEY (widget_id);
CREATE INDEX auth_group_name_a6ea08ec_like ON budgetbuddy.auth_group USING btree (name varchar_pattern_ops);
CREATE INDEX auth_group_permissions_group_id_b120cbf9 ON budgetbuddy.auth_group_permissions USING btree (group_id);
CREATE INDEX auth_group_permissions_permission_id_84c5c92e ON budgetbuddy.auth_group_permissions USING btree (permission_id);
CREATE INDEX auth_permission_content_type_id_2f476e4b ON budgetbuddy.auth_permission USING btree (content_type_id);
CREATE INDEX authtoken_token_key_10f0b77e_like ON budgetbuddy.authtoken_token USING btree (key varchar_pattern_ops);
CREATE INDEX budget_category_id_706cf216 ON budgetbuddy.budget USING btree (category_id);
CREATE INDEX budget_user_id_5ffc89a5 ON budgetbuddy.budget USING btree (user_id);
CREATE INDEX challenge_difficulty_id_3c826a09 ON budgetbuddy.challenge USING btree (difficulty_id);
CREATE INDEX challenge_inventory_challenge_id_7d776e63 ON budgetbuddy.challenge_inventory USING btree (challenge_id);
CREATE INDEX challenge_inventory_user_id_994218db ON budgetbuddy.challenge_inventory USING btree (user_id);
CREATE INDEX challenge_item_id_8eed67df ON budgetbuddy.challenge USING btree (item_id);
CREATE INDEX challenge_trigger_id_e956f817 ON budgetbuddy.challenge USING btree (trigger_id);
CREATE INDEX competitions_competition_status_id_10a98e4d ON budgetbuddy.competitions USING btree (competition_status_id);
CREATE INDEX competitions_user_id_1c9b87f4 ON budgetbuddy.competitions USING btree (user_id);
CREATE INDEX django_admin_log_content_type_id_c4bce8eb ON budgetbuddy.django_admin_log USING btree (content_type_id);
CREATE INDEX django_admin_log_user_id_c564eba6 ON budgetbuddy.django_admin_log USING btree (user_id);
CREATE INDEX django_session_expire_date_a5c62663 ON budgetbuddy.django_session USING btree (expire_date);
CREATE INDEX django_session_session_key_c0390e0f_like ON budgetbuddy.django_session USING btree (session_key varchar_pattern_ops);
CREATE INDEX friends_friend_status_id_53e68725 ON budgetbuddy.friends USING btree (friend_status_id);
CREATE INDEX friends_user_id_ff14f94c ON budgetbuddy.friends USING btree (user_id);
CREATE INDEX global_competitions_user_id_0bb299ef ON budgetbuddy.global_competitions USING btree (user_id);
CREATE INDEX income_category_id_bcfe7a76 ON budgetbuddy.income USING btree (category_id);
CREATE INDEX income_receipt_id_87fd71ed ON budgetbuddy.income USING btree (receipt_id);
CREATE INDEX inventory_item_id_61323698 ON budgetbuddy.inventory USING btree (item_id);
CREATE INDEX inventory_user_id_4fd9bf7f ON budgetbuddy.inventory USING btree (user_id);
CREATE INDEX items_difficulty_id_4c20de67 ON budgetbuddy.items USING btree (difficulty_id);
CREATE INDEX levels_challenge_id_88f53826 ON budgetbuddy.levels USING btree (challenge_id);
CREATE INDEX levels_item_id_8d79c29b ON budgetbuddy.levels USING btree (item_id);
CREATE INDEX notifications_list_notification_id_7748c666 ON budgetbuddy.notifications_list USING btree (notification_id);
CREATE INDEX notifications_list_user_id_7297689a ON budgetbuddy.notifications_list USING btree (user_id);
CREATE INDEX product_category_id_640030a0 ON budgetbuddy.product USING btree (category_id);
CREATE INDEX product_receipt_id_1f436860 ON budgetbuddy.product USING btree (receipt_id);
CREATE INDEX receipt_user_id_14039b19 ON budgetbuddy.receipt USING btree (user_id);
CREATE INDEX user_budget_goal_user_id_7fb04866 ON budgetbuddy.user_budget_goal USING btree (user_id);
CREATE INDEX users_email_0ea73cca_like ON budgetbuddy.users USING btree (email varchar_pattern_ops);
CREATE INDEX users_password_3b9e8b7b_like ON budgetbuddy.users USING btree (password varchar_pattern_ops);
CREATE INDEX users_phone_number_b4cde146_like ON budgetbuddy.users USING btree (phone_number varchar_pattern_ops);
CREATE INDEX users_security_question_id_11b0d2fe ON budgetbuddy.users USING btree (security_question_id);
CREATE INDEX users_username_e8658fc8_like ON budgetbuddy.users USING btree (username varchar_pattern_ops);
CREATE INDEX widget_inventory_user_id_65f1eeda ON budgetbuddy.widget_inventory USING btree (user_id);
CREATE INDEX widget_inventory_widget_id_f7b3d58a ON budgetbuddy.widget_inventory USING btree (widget_id);
ALTER TABLE ONLY budgetbuddy.auth_group_permissions
    ADD CONSTRAINT auth_group_permissio_permission_id_84c5c92e_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES budgetbuddy.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY budgetbuddy.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES budgetbuddy.auth_group(id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY budgetbuddy.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_2f476e4b_fk_django_co FOREIGN KEY (content_type_id) REFERENCES budgetbuddy.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY budgetbuddy.authtoken_token
    ADD CONSTRAINT authtoken_token_user_id_35299eff_fk_users_user_id FOREIGN KEY (user_id) REFERENCES budgetbuddy.users(user_id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY budgetbuddy.budget
    ADD CONSTRAINT budget_category_id_706cf216_fk_category_category_id FOREIGN KEY (category_id) REFERENCES budgetbuddy.category(category_id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY budgetbuddy.budget
    ADD CONSTRAINT budget_user_id_5ffc89a5_fk_users_user_id FOREIGN KEY (user_id) REFERENCES budgetbuddy.users(user_id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY budgetbuddy.challenge
    ADD CONSTRAINT challenge_difficulty_id_3c826a09_fk_difficulty_difficulty_id FOREIGN KEY (difficulty_id) REFERENCES budgetbuddy.difficulty(difficulty_id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY budgetbuddy.challenge_inventory
    ADD CONSTRAINT challenge_inventory_challenge_id_7d776e63_fk_challenge FOREIGN KEY (challenge_id) REFERENCES budgetbuddy.challenge(challenge_id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY budgetbuddy.challenge_inventory
    ADD CONSTRAINT challenge_inventory_user_id_994218db_fk_users_user_id FOREIGN KEY (user_id) REFERENCES budgetbuddy.users(user_id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY budgetbuddy.challenge
    ADD CONSTRAINT challenge_item_id_8eed67df_fk_items_item_id FOREIGN KEY (item_id) REFERENCES budgetbuddy.items(item_id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY budgetbuddy.challenge
    ADD CONSTRAINT challenge_trigger_id_e956f817_fk_trigger_trigger_id FOREIGN KEY (trigger_id) REFERENCES budgetbuddy.trigger(trigger_id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY budgetbuddy.competitions
    ADD CONSTRAINT competitions_competition_status_i_10a98e4d_fk_competiti FOREIGN KEY (competition_status_id) REFERENCES budgetbuddy.competition_status(competition_status_id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY budgetbuddy.competitions
    ADD CONSTRAINT competitions_user_id_1c9b87f4_fk_users_user_id FOREIGN KEY (user_id) REFERENCES budgetbuddy.users(user_id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY budgetbuddy.django_admin_log
    ADD CONSTRAINT django_admin_log_content_type_id_c4bce8eb_fk_django_co FOREIGN KEY (content_type_id) REFERENCES budgetbuddy.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY budgetbuddy.django_admin_log
    ADD CONSTRAINT django_admin_log_user_id_c564eba6_fk_users_user_id FOREIGN KEY (user_id) REFERENCES budgetbuddy.users(user_id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY budgetbuddy.friends
    ADD CONSTRAINT friends_friend_status_id_53e68725_fk_friend_st FOREIGN KEY (friend_status_id) REFERENCES budgetbuddy.friend_status(friend_status_id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY budgetbuddy.friends
    ADD CONSTRAINT friends_user_id_ff14f94c_fk_users_user_id FOREIGN KEY (user_id) REFERENCES budgetbuddy.users(user_id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY budgetbuddy.global_competitions
    ADD CONSTRAINT global_competitions_user_id_0bb299ef_fk_users_user_id FOREIGN KEY (user_id) REFERENCES budgetbuddy.users(user_id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY budgetbuddy.income
    ADD CONSTRAINT income_category_id_bcfe7a76_fk_category_category_id FOREIGN KEY (category_id) REFERENCES budgetbuddy.category(category_id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY budgetbuddy.income
    ADD CONSTRAINT income_receipt_id_87fd71ed_fk_receipt_receipt_id FOREIGN KEY (receipt_id) REFERENCES budgetbuddy.receipt(receipt_id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY budgetbuddy.inventory
    ADD CONSTRAINT inventory_item_id_61323698_fk_items_item_id FOREIGN KEY (item_id) REFERENCES budgetbuddy.items(item_id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY budgetbuddy.inventory
    ADD CONSTRAINT inventory_user_id_4fd9bf7f_fk_users_user_id FOREIGN KEY (user_id) REFERENCES budgetbuddy.users(user_id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY budgetbuddy.items
    ADD CONSTRAINT items_difficulty_id_4c20de67_fk_difficulty_difficulty_id FOREIGN KEY (difficulty_id) REFERENCES budgetbuddy.difficulty(difficulty_id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY budgetbuddy.levels
    ADD CONSTRAINT levels_challenge_id_88f53826_fk_challenge_challenge_id FOREIGN KEY (challenge_id) REFERENCES budgetbuddy.challenge(challenge_id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY budgetbuddy.levels
    ADD CONSTRAINT levels_item_id_8d79c29b_fk_items_item_id FOREIGN KEY (item_id) REFERENCES budgetbuddy.items(item_id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY budgetbuddy.notifications_list
    ADD CONSTRAINT notifications_list_notification_id_7748c666_fk_notificat FOREIGN KEY (notification_id) REFERENCES budgetbuddy.notifications(notification_id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY budgetbuddy.notifications_list
    ADD CONSTRAINT notifications_list_user_id_7297689a_fk_users_user_id FOREIGN KEY (user_id) REFERENCES budgetbuddy.users(user_id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY budgetbuddy.product
    ADD CONSTRAINT product_category_id_640030a0_fk_category_category_id FOREIGN KEY (category_id) REFERENCES budgetbuddy.category(category_id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY budgetbuddy.product
    ADD CONSTRAINT product_receipt_id_1f436860_fk_receipt_receipt_id FOREIGN KEY (receipt_id) REFERENCES budgetbuddy.receipt(receipt_id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY budgetbuddy.receipt
    ADD CONSTRAINT receipt_user_id_14039b19_fk_users_user_id FOREIGN KEY (user_id) REFERENCES budgetbuddy.users(user_id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY budgetbuddy.user_budget_goal
    ADD CONSTRAINT user_budget_goal_user_id_7fb04866_fk_users_user_id FOREIGN KEY (user_id) REFERENCES budgetbuddy.users(user_id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY budgetbuddy.users
    ADD CONSTRAINT users_security_question_id_11b0d2fe_fk_security_ FOREIGN KEY (security_question_id) REFERENCES budgetbuddy.security_question(security_question_id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY budgetbuddy.widget_inventory
    ADD CONSTRAINT widget_inventory_user_id_65f1eeda_fk_users_user_id FOREIGN KEY (user_id) REFERENCES budgetbuddy.users(user_id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY budgetbuddy.widget_inventory
    ADD CONSTRAINT widget_inventory_widget_id_f7b3d58a_fk_widget_widget_id FOREIGN KEY (widget_id) REFERENCES budgetbuddy.widget(widget_id) DEFERRABLE INITIALLY DEFERRED;
