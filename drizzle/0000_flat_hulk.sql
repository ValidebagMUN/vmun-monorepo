DO $$ BEGIN
 CREATE TYPE "document_type" AS ENUM('text', 'link');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "session_type" AS ENUM('regular', 'special', 'emergency');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "user_type" AS ENUM('chair', 'staff', 'admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chairs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"created_at" timestamp DEFAULT now(),
	"user_id" integer,
	"committee_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "committees" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"slug" varchar(10),
	"agenda" varchar[],
	"representatives" jsonb,
	CONSTRAINT "committees_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"proposer" integer,
	"document_type" "document_type",
	"content" text,
	"created_at" timestamp DEFAULT now(),
	"committee_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" integer,
	"session_type" "session_type",
	"started_at" timestamp,
	"committee_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar,
	"password" varchar,
	"created_at" timestamp DEFAULT now(),
	"last_login" timestamp,
	"user_type" "user_type",
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chairs" ADD CONSTRAINT "chairs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chairs" ADD CONSTRAINT "chairs_committee_id_committees_id_fk" FOREIGN KEY ("committee_id") REFERENCES "committees"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "documents" ADD CONSTRAINT "documents_committee_id_committees_id_fk" FOREIGN KEY ("committee_id") REFERENCES "committees"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_committee_id_committees_id_fk" FOREIGN KEY ("committee_id") REFERENCES "committees"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
