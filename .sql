
-- Drop table

-- DROP TABLE "access";

CREATE TABLE "access" (
	id varchar(100) NOT NULL,
	ticket_id varchar(100) NOT NULL,
	user_id varchar(100) NULL,
	role_id varchar(100) NULL,
	"permission" varchar(200) NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	deleted_at timestamptz NULL
);


-- Drop table

-- DROP TABLE category;

CREATE TABLE category (
	id varchar(100) NOT NULL,
	"name" varchar(200) NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	deleted_at timestamptz NULL,
	CONSTRAINT category_pkey PRIMARY KEY (id)
);


-- Drop table

-- DROP TABLE "role";

CREATE TABLE "role" (
	id varchar(100) NOT NULL,
	"name" varchar(200) NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	deleted_at timestamptz NULL,
	CONSTRAINT role_pkey PRIMARY KEY (id)
);

-- Drop table

-- DROP TABLE ticket;

CREATE TABLE ticket (
	id varchar(100) NOT NULL,
	category_id varchar(100) NOT NULL,
	"name" varchar(200) NOT NULL,
	description varchar(2000) NULL,
	attachment _varchar NOT NULL,
	status varchar(200) NOT NULL,
	created_by varchar(100) NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	deleted_at timestamptz NULL,
	priority varchar(200) NOT NULL,
	CONSTRAINT ticket_pkey PRIMARY KEY (id)
);

ALTER TABLE ticket ADD CONSTRAINT ticket_category_fk FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE ticket ADD CONSTRAINT ticket_user_created_fk FOREIGN KEY (created_by) REFERENCES "user"(id) ON DELETE CASCADE ON UPDATE CASCADE;


-- Drop table

-- DROP TABLE "user";

CREATE TABLE "user" (
	id varchar(100) NOT NULL,
	role_id varchar(100) NOT NULL,
	first_name varchar(200) NOT NULL,
	last_name varchar(200) NULL,
	phone varchar(200) NULL,
	"password" text NOT NULL,
	email varchar(200) NULL,
	is_phone_verified bool NOT NULL DEFAULT false,
	is_email_verified bool NOT NULL DEFAULT false,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	deleted_at timestamptz NULL,
	country_code varchar(5) NULL,
	verification_token varchar NULL,
	reset_password_token varchar NULL,
	reset_expiry timestamptz NULL,
	CONSTRAINT "User_pkey" PRIMARY KEY (id)
);

INSERT INTO category (id,"name",created_at,updated_at,deleted_at) VALUES
('1hd8xyk00000000','Back-end','2021-06-24 17:47:23.511','2021-06-24 17:47:23.511',NULL)
,('1hd8xyu00000000','Front-end','2021-06-24 17:47:30.741','2021-06-24 17:47:30.741',NULL)
;

INSERT INTO "role" (id,"name",created_at,updated_at,deleted_at) VALUES
('1hd8dmw00000000','Back-end','2021-06-24 13:09:08.578','2021-06-24 13:09:08.578',NULL)
,('1hd8dn500000000','Front-end','2021-06-24 13:09:17.630','2021-06-24 13:09:17.630',NULL)
,('1hd8dr000000000','DevOps','2021-06-24 13:10:16.399','2021-06-24 13:10:16.399',NULL)
;
