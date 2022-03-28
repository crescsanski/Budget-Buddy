CREATE TABLE IF NOT EXISTS budgetbuddy.users
(
    user_id SERIAL,
    user_first_name character varying(255) ,
    user_last_name character varying(255) ,
    user_user_name character varying(255)  NOT NULL,
    user_email character varying(255)  NOT NULL,
    password character varying(255)  NOT NULL,
    user_phone_number character varying(14) ,
    user_registration_date date NOT NULL,
    user_birth_date date NOT NULL,
    user_has_notifications boolean NOT NULL,
    user_budget_goal_amount integer,
    user_experience_points integer,
    security_question_id integer,
    user_security_question_answer character varying(255)  NOT NULL,
    is_active boolean,
    is_admin boolean,
    last_login timestamp with time zone,
    CONSTRAINT users_pkey PRIMARY KEY (user_id),
    CONSTRAINT users_user_email_key UNIQUE (user_email),
    CONSTRAINT users_user_phone_number_key UNIQUE (user_phone_number),
    CONSTRAINT users_user_user_name_key UNIQUE (user_user_name),
    CONSTRAINT fk_userssecurityquestion FOREIGN KEY (security_question_id)
        REFERENCES budgetbuddy.security_question (security_question_id)
);

CREATE TABLE IF NOT EXISTS budgetbuddy.auth_group
(
    id SERIAL,
    name character varying(150) NOT NULL,
    CONSTRAINT auth_group_pkey PRIMARY KEY (id),
    CONSTRAINT auth_group_name_key UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS budgetbuddy.django_content_type
(
    id SERIAL,
    app_label character varying(100) NOT NULL,
    model character varying(100) NOT NULL,
    CONSTRAINT django_content_type_pkey PRIMARY KEY (id),
    CONSTRAINT django_content_type_app_label_model_76bd3d3b_uniq UNIQUE (app_label, model)
);

CREATE TABLE IF NOT EXISTS budgetbuddy.auth_permission
(
    id SERIAL,
    name character varying(255) NOT NULL,
    content_type_id integer NOT NULL,
    codename character varying(100) NOT NULL,
    CONSTRAINT auth_permission_pkey PRIMARY KEY (id),
    CONSTRAINT auth_permission_content_type_id_codename_01ab375a_uniq UNIQUE (content_type_id, codename),
    CONSTRAINT auth_permission_content_type_id_2f476e4b_fk_django_co FOREIGN KEY (content_type_id)
        REFERENCES budgetbuddy.django_content_type (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE IF NOT EXISTS budgetbuddy.auth_group_permissions
(
    id BIGSERIAL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL,
    CONSTRAINT auth_group_permissions_pkey PRIMARY KEY (id),
    CONSTRAINT auth_group_permissions_group_id_permission_id_0cd325b0_uniq UNIQUE (group_id, permission_id),
    CONSTRAINT auth_group_permissio_permission_id_84c5c92e_fk_auth_perm FOREIGN KEY (permission_id)
        REFERENCES budgetbuddy.auth_permission (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        DEFERRABLE INITIALLY DEFERRED,
    CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id FOREIGN KEY (group_id)
        REFERENCES budgetbuddy.auth_group (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        DEFERRABLE INITIALLY DEFERRED
);


CREATE TABLE IF NOT EXISTS budgetbuddy.authtoken_token
(
    key character varying(40) NOT NULL,
    created timestamp with time zone NOT NULL,
    user_id integer NOT NULL,
    CONSTRAINT authtoken_token_pkey PRIMARY KEY (key),
    CONSTRAINT authtoken_token_user_id_key UNIQUE (user_id),
    CONSTRAINT authtoken_token_user_id_35299eff_fk_users_user_id FOREIGN KEY (user_id)
        REFERENCES budgetbuddy.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE IF NOT EXISTS budgetbuddy.django_admin_log
(
    id SERIAL,
    action_time timestamp with time zone NOT NULL,
    object_id text,
    object_repr character varying(200) NOT NULL,
    action_flag smallint NOT NULL,
    change_message text NOT NULL,
    content_type_id integer,
    user_id integer NOT NULL,
    CONSTRAINT django_admin_log_pkey PRIMARY KEY (id),
    CONSTRAINT django_admin_log_content_type_id_c4bce8eb_fk_django_co FOREIGN KEY (content_type_id)
        REFERENCES budgetbuddy.django_content_type (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        DEFERRABLE INITIALLY DEFERRED,
    CONSTRAINT django_admin_log_user_id_c564eba6_fk_users_user_id FOREIGN KEY (user_id)
        REFERENCES budgetbuddy.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        DEFERRABLE INITIALLY DEFERRED,
    CONSTRAINT django_admin_log_action_flag_check CHECK (action_flag >= 0)
);



CREATE TABLE IF NOT EXISTS budgetbuddy.django_migrations
(
    id BIGSERIAL,
    app character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL,
    CONSTRAINT django_migrations_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS budgetbuddy.django_session
(
    session_key character varying(40) NOT NULL,
    session_data text NOT NULL,
    expire_date timestamp with time zone NOT NULL,
    CONSTRAINT django_session_pkey PRIMARY KEY (session_key)
);