
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE SCHEMA "private";

ALTER SCHEMA "private" OWNER TO "postgres";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "private"."enum_page_types" AS ENUM (
    'INDEX',
    'BLOG',
    'PROJECT',
    'ROUTE',
    'PATH',
    'POST'
);

ALTER TYPE "private"."enum_page_types" OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE "private"."installation" (
    "db_id" integer NOT NULL,
    "event_id" "text" NOT NULL,
    "event_name" "text" NOT NULL,
    "created_at" "text" NOT NULL,
    "updated_at" "text" NOT NULL,
    "db_created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "db_updated_at" timestamp(3) without time zone NOT NULL,
    "db_deleted_at" timestamp(3) without time zone,
    "db_deleted" boolean DEFAULT false NOT NULL,
    "id" integer NOT NULL,
    "account" integer NOT NULL,
    "sender" integer,
    "db_name" "text" DEFAULT 'default'::"text" NOT NULL
);

ALTER TABLE "private"."installation" OWNER TO "postgres";

CREATE SEQUENCE "private"."installation_db_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "private"."installation_db_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "private"."installation_db_id_seq" OWNED BY "private"."installation"."db_id";

CREATE TABLE "private"."page_content" (
    "db_id" integer NOT NULL,
    "db_user_id" integer NOT NULL,
    "db_display_name" "text" NOT NULL,
    "display_name" "text" NOT NULL,
    "type" integer NOT NULL,
    "id" integer NOT NULL,
    "node_id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "db_blob_name" "text" NOT NULL,
    "db_blob_url" "text" NOT NULL,
    "private" boolean NOT NULL
);

ALTER TABLE "private"."page_content" OWNER TO "postgres";

CREATE SEQUENCE "private"."page_content_db_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "private"."page_content_db_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "private"."page_content_db_id_seq" OWNED BY "private"."page_content"."db_id";

CREATE TABLE "private"."page_types" (
    "id" integer NOT NULL,
    "type" "private"."enum_page_types" NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL,
    "deleted_at" timestamp(3) without time zone,
    "deleted" boolean DEFAULT false NOT NULL
);

ALTER TABLE "private"."page_types" OWNER TO "postgres";

CREATE SEQUENCE "private"."page_types_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "private"."page_types_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "private"."page_types_id_seq" OWNED BY "private"."page_types"."id";

CREATE TABLE "private"."user" (
    "db_id" integer NOT NULL,
    "login" "text" NOT NULL,
    "node_id" "text" NOT NULL,
    "avatar_url" "text" NOT NULL,
    "gravatar_id" "text" NOT NULL,
    "url" "text" NOT NULL,
    "html_url" "text" NOT NULL,
    "following_url" "text" NOT NULL,
    "followers_url" "text" NOT NULL,
    "gists_url" "text" NOT NULL,
    "starred_url" "text" NOT NULL,
    "subscriptions_url" "text" NOT NULL,
    "organizations_url" "text" NOT NULL,
    "repos_url" "text" NOT NULL,
    "events_url" "text" NOT NULL,
    "received_events_url" "text" NOT NULL,
    "type" "text" NOT NULL,
    "db_created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "db_updated_at" timestamp(3) without time zone NOT NULL,
    "db_deleted_at" timestamp(3) without time zone,
    "db_deleted" boolean DEFAULT false NOT NULL,
    "id" integer NOT NULL,
    "site_admin" boolean NOT NULL
);

ALTER TABLE "private"."user" OWNER TO "postgres";

CREATE SEQUENCE "private"."user_db_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "private"."user_db_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "private"."user_db_id_seq" OWNED BY "private"."user"."db_id";

CREATE TABLE "public"."_prisma_migrations" (
    "id" character varying(36) NOT NULL,
    "checksum" character varying(64) NOT NULL,
    "finished_at" timestamp with time zone,
    "migration_name" character varying(255) NOT NULL,
    "logs" "text",
    "rolled_back_at" timestamp with time zone,
    "started_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "applied_steps_count" integer DEFAULT 0 NOT NULL
);

ALTER TABLE "public"."_prisma_migrations" OWNER TO "postgres";

ALTER TABLE ONLY "private"."installation" ALTER COLUMN "db_id" SET DEFAULT "nextval"('"private"."installation_db_id_seq"'::"regclass");

ALTER TABLE ONLY "private"."page_content" ALTER COLUMN "db_id" SET DEFAULT "nextval"('"private"."page_content_db_id_seq"'::"regclass");

ALTER TABLE ONLY "private"."page_types" ALTER COLUMN "id" SET DEFAULT "nextval"('"private"."page_types_id_seq"'::"regclass");

ALTER TABLE ONLY "private"."user" ALTER COLUMN "db_id" SET DEFAULT "nextval"('"private"."user_db_id_seq"'::"regclass");

ALTER TABLE ONLY "private"."installation"
    ADD CONSTRAINT "installation_pkey" PRIMARY KEY ("db_id");

ALTER TABLE ONLY "private"."page_content"
    ADD CONSTRAINT "page_content_pkey" PRIMARY KEY ("db_id");

ALTER TABLE ONLY "private"."page_types"
    ADD CONSTRAINT "page_types_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "private"."user"
    ADD CONSTRAINT "user_pkey" PRIMARY KEY ("db_id");

ALTER TABLE ONLY "public"."_prisma_migrations"
    ADD CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id");

CREATE UNIQUE INDEX "installation_account_key" ON "private"."installation" USING "btree" ("account");

CREATE UNIQUE INDEX "installation_db_name_key" ON "private"."installation" USING "btree" ("db_name");

CREATE UNIQUE INDEX "installation_id_key" ON "private"."installation" USING "btree" ("id");

CREATE UNIQUE INDEX "page_types_type_key" ON "private"."page_types" USING "btree" ("type");

CREATE UNIQUE INDEX "user_id_key" ON "private"."user" USING "btree" ("id");

CREATE UNIQUE INDEX "user_login_key" ON "private"."user" USING "btree" ("login");

ALTER TABLE ONLY "private"."installation"
    ADD CONSTRAINT "installation_user_account" FOREIGN KEY ("account") REFERENCES "private"."user"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "private"."installation"
    ADD CONSTRAINT "installation_user_sender" FOREIGN KEY ("sender") REFERENCES "private"."user"("id") ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "private"."page_content"
    ADD CONSTRAINT "page_content_db_user_id_fkey" FOREIGN KEY ("db_user_id") REFERENCES "private"."user"("db_id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "private"."page_content"
    ADD CONSTRAINT "page_content_type_fkey" FOREIGN KEY ("type") REFERENCES "private"."page_types"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON TABLE "public"."_prisma_migrations" TO "anon";
GRANT ALL ON TABLE "public"."_prisma_migrations" TO "authenticated";
GRANT ALL ON TABLE "public"."_prisma_migrations" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
