DROP SCHEMA public CASCADE;
CREATE SCHEMA IF NOT EXISTS public;


CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


--Automate update update_dt
CREATE OR REPLACE FUNCTION trigger_set_updated_dt()
RETURNS TRIGGER AS $$
BEGIN
NEW.update_dt = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;


--Define table
CREATE TABLE "public"."todo" (
  "todo_id" serial PRIMARY KEY,
  "todo_ttile" varchar NOT NULL,
  "completed" boolean,
  "created_dt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_dt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "public"."worker"(
  "worker_id" serial PRIMARY KEY,
  "username" varchar NOT NULL,
  "password" varchar,
  "last_logon_dt" timestamp,
  "user_type" int8,
  "created_dt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_dt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
);


CREATE TABLE "public".session (
  "session_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "staff_id" int8 NOT NULL REFERENCES staff (staff_id),
  "ip_address" varchar NOT NULL,
  "created_dt" timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("session_id")
);
