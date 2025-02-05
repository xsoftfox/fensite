-- Adminer 4.8.1 PostgreSQL 14.15 (Ubuntu 14.15-0ubuntu0.22.04.1) dump

DROP TABLE IF EXISTS "boxes";
CREATE TABLE "public"."boxes" (
    "data" json NOT NULL
) WITH (oids = false);


DROP TABLE IF EXISTS "chat";
CREATE TABLE "public"."chat" (
    "user" text NOT NULL,
    "message" text NOT NULL,
    "timestamp" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "color" text NOT NULL
) WITH (oids = false);


DROP TABLE IF EXISTS "fart";
CREATE TABLE "public"."fart" (
    "text" text NOT NULL,
    "time" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
) WITH (oids = false);


DROP TABLE IF EXISTS "stats";
CREATE TABLE "public"."stats" (
    "session" text,
    "path" text,
    "useragent" text,
    "referrer" text,
    "params" text,
    "date" timestamp DEFAULT CURRENT_DATE NOT NULL
) WITH (oids = false);


-- 2025-02-05 17:49:12.800942-05
