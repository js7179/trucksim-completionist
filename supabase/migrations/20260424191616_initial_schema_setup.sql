create schema if not exists "tsim";

create type "tsim"."trucksim_game" as enum ('ets2', 'ats');

create sequence "tsim"."info_objnid_seq";

create table "tsim"."info_achievement" (
  "ach_nid" integer generated always as identity not null,
  "ach_tid" text not null,
  "game" tsim.trucksim_game not null
);

create table "tsim"."info_obj_counter" (
  "obj_nid" integer not null default nextval('tsim.info_objnid_seq'::regclass),
  "ach_nid" integer not null,
  "obj_tid" text not null,
  "goal" integer not null
);

create table "tsim"."info_obj_list" (
  "obj_nid" integer not null default nextval('tsim.info_objnid_seq'::regclass),
  "ach_nid" integer not null,
  "obj_tid" text not null
);

create table "tsim"."info_obj_list_subobjs" (
  "subobj_nid" integer generated always as identity not null,
  "obj_nid" integer not null,
  "subobj_tid" text not null
);

create table "tsim"."info_obj_partial" (
  "obj_nid" integer not null default nextval('tsim.info_objnid_seq'::regclass),
  "ach_nid" integer not null,
  "obj_tid" text not null,
  "goal_count" integer not null
);

create table "tsim"."info_obj_partial_subobjs" (
  "subobj_nid" integer generated always as identity not null,
  "obj_nid" integer not null,
  "subobj_tid" text not null
);

create table "tsim"."info_obj_sequential" (
  "obj_nid" integer not null default nextval('tsim.info_objnid_seq'::regclass),
  "ach_nid" integer not null,
  "obj_tid" text not null,
  "number_of_steps" integer not null
);

create table "tsim"."data_ach_completed" (
  "uid" uuid not null,
  "ach_nid" integer not null,
  "is_completed" boolean not null default false
);

create table "tsim"."data_last_updated" (
  "uid" uuid not null,
  "game" tsim.trucksim_game not null,
  "last_updated" timestamp with time zone default now()
);

create table "tsim"."data_obj_counter" (
  "uid" uuid not null,
  "obj_nid" integer not null,
  "val" integer not null default 0
);

create table "tsim"."data_obj_list_subobjs" (
  "uid" uuid not null,
  "subobj_nid" integer not null
);

create table "tsim"."data_obj_partial_subobjs" (
  "uid" uuid not null,
  "subobj_nid" integer not null
);

create table "tsim"."data_obj_sequential" (
  "uid" uuid not null,
  "obj_nid" integer not null,
  "current_step" integer default 0
);


CREATE UNIQUE INDEX data_ach_completed_pkey ON tsim.data_ach_completed USING btree (uid, ach_nid);
CREATE UNIQUE INDEX data_last_updated_pkey ON tsim.data_last_updated USING btree (uid, game);
CREATE UNIQUE INDEX data_obj_counter_pkey ON tsim.data_obj_counter USING btree (uid, obj_nid);
CREATE UNIQUE INDEX data_obj_list_subobjs_pkey ON tsim.data_obj_list_subobjs USING btree (uid, subobj_nid);
CREATE UNIQUE INDEX data_obj_partial_subobjs_pkey ON tsim.data_obj_partial_subobjs USING btree (uid, subobj_nid);
CREATE UNIQUE INDEX data_obj_sequential_pkey ON tsim.data_obj_sequential USING btree (uid, obj_nid);
CREATE UNIQUE INDEX info_achievement_game_ach_tid_key ON tsim.info_achievement USING btree (game, ach_tid);
CREATE UNIQUE INDEX info_achievement_pkey ON tsim.info_achievement USING btree (ach_nid);
CREATE UNIQUE INDEX info_obj_counter_ach_nid_obj_tid_key ON tsim.info_obj_counter USING btree (ach_nid, obj_tid);
CREATE UNIQUE INDEX info_obj_counter_pkey ON tsim.info_obj_counter USING btree (obj_nid);
CREATE UNIQUE INDEX info_obj_list_ach_nid_obj_tid_key ON tsim.info_obj_list USING btree (ach_nid, obj_tid);
CREATE UNIQUE INDEX info_obj_list_pkey ON tsim.info_obj_list USING btree (obj_nid);
CREATE UNIQUE INDEX info_obj_list_subobjs_obj_nid_subobj_tid_key ON tsim.info_obj_list_subobjs USING btree (obj_nid, subobj_tid);
CREATE UNIQUE INDEX info_obj_list_subobjs_pkey ON tsim.info_obj_list_subobjs USING btree (subobj_nid);
CREATE UNIQUE INDEX info_obj_partial_ach_nid_obj_tid_key ON tsim.info_obj_partial USING btree (ach_nid, obj_tid);
CREATE UNIQUE INDEX info_obj_partial_pkey ON tsim.info_obj_partial USING btree (obj_nid);
CREATE UNIQUE INDEX info_obj_partial_subobjs_obj_nid_subobj_tid_key ON tsim.info_obj_partial_subobjs USING btree (obj_nid, subobj_tid);
CREATE UNIQUE INDEX info_obj_partial_subobjs_pkey ON tsim.info_obj_partial_subobjs USING btree (subobj_nid);
CREATE UNIQUE INDEX info_obj_sequential_ach_nid_obj_tid_key ON tsim.info_obj_sequential USING btree (ach_nid, obj_tid);
CREATE UNIQUE INDEX info_obj_sequential_pkey ON tsim.info_obj_sequential USING btree (obj_nid);

alter table "tsim"."data_ach_completed" add constraint "data_ach_completed_pkey" PRIMARY KEY using index "data_ach_completed_pkey";
alter table "tsim"."data_last_updated" add constraint "data_last_updated_pkey" PRIMARY KEY using index "data_last_updated_pkey";
alter table "tsim"."data_obj_counter" add constraint "data_obj_counter_pkey" PRIMARY KEY using index "data_obj_counter_pkey";
alter table "tsim"."data_obj_list_subobjs" add constraint "data_obj_list_subobjs_pkey" PRIMARY KEY using index "data_obj_list_subobjs_pkey";
alter table "tsim"."data_obj_partial_subobjs" add constraint "data_obj_partial_subobjs_pkey" PRIMARY KEY using index "data_obj_partial_subobjs_pkey";
alter table "tsim"."data_obj_sequential" add constraint "data_obj_sequential_pkey" PRIMARY KEY using index "data_obj_sequential_pkey";
alter table "tsim"."info_achievement" add constraint "info_achievement_pkey" PRIMARY KEY using index "info_achievement_pkey";
alter table "tsim"."info_obj_counter" add constraint "info_obj_counter_pkey" PRIMARY KEY using index "info_obj_counter_pkey";
alter table "tsim"."info_obj_list" add constraint "info_obj_list_pkey" PRIMARY KEY using index "info_obj_list_pkey";
alter table "tsim"."info_obj_list_subobjs" add constraint "info_obj_list_subobjs_pkey" PRIMARY KEY using index "info_obj_list_subobjs_pkey";
alter table "tsim"."info_obj_partial" add constraint "info_obj_partial_pkey" PRIMARY KEY using index "info_obj_partial_pkey";
alter table "tsim"."info_obj_partial_subobjs" add constraint "info_obj_partial_subobjs_pkey" PRIMARY KEY using index "info_obj_partial_subobjs_pkey";
alter table "tsim"."info_obj_sequential" add constraint "info_obj_sequential_pkey" PRIMARY KEY using index "info_obj_sequential_pkey";
alter table "tsim"."data_ach_completed" add constraint "data_ach_completed_ach_nid_fkey" FOREIGN KEY (ach_nid) REFERENCES tsim.info_achievement(ach_nid) not valid;
alter table "tsim"."data_ach_completed" validate constraint "data_ach_completed_ach_nid_fkey";
alter table "tsim"."data_ach_completed" add constraint "data_ach_completed_uid_fkey" FOREIGN KEY (uid) REFERENCES auth.users(id) ON DELETE CASCADE not valid;
alter table "tsim"."data_ach_completed" validate constraint "data_ach_completed_uid_fkey";
alter table "tsim"."data_last_updated" add constraint "data_last_updated_uid_fkey" FOREIGN KEY (uid) REFERENCES auth.users(id) ON DELETE CASCADE not valid;
alter table "tsim"."data_last_updated" validate constraint "data_last_updated_uid_fkey";
alter table "tsim"."data_obj_counter" add constraint "data_obj_counter_obj_nid_fkey" FOREIGN KEY (obj_nid) REFERENCES tsim.info_obj_counter(obj_nid) not valid;
alter table "tsim"."data_obj_counter" validate constraint "data_obj_counter_obj_nid_fkey";
alter table "tsim"."data_obj_counter" add constraint "data_obj_counter_uid_fkey" FOREIGN KEY (uid) REFERENCES auth.users(id) ON DELETE CASCADE not valid;
alter table "tsim"."data_obj_counter" validate constraint "data_obj_counter_uid_fkey";
alter table "tsim"."data_obj_list_subobjs" add constraint "data_obj_list_subobjs_subobj_nid_fkey" FOREIGN KEY (subobj_nid) REFERENCES tsim.info_obj_list_subobjs(subobj_nid) not valid;
alter table "tsim"."data_obj_list_subobjs" validate constraint "data_obj_list_subobjs_subobj_nid_fkey";
alter table "tsim"."data_obj_list_subobjs" add constraint "data_obj_list_subobjs_uid_fkey" FOREIGN KEY (uid) REFERENCES auth.users(id) ON DELETE CASCADE not valid;
alter table "tsim"."data_obj_list_subobjs" validate constraint "data_obj_list_subobjs_uid_fkey";
alter table "tsim"."data_obj_partial_subobjs" add constraint "data_obj_partial_subobjs_subobj_nid_fkey" FOREIGN KEY (subobj_nid) REFERENCES tsim.info_obj_partial_subobjs(subobj_nid) not valid;
alter table "tsim"."data_obj_partial_subobjs" validate constraint "data_obj_partial_subobjs_subobj_nid_fkey";
alter table "tsim"."data_obj_partial_subobjs" add constraint "data_obj_partial_subobjs_uid_fkey" FOREIGN KEY (uid) REFERENCES auth.users(id) ON DELETE CASCADE not valid;
alter table "tsim"."data_obj_partial_subobjs" validate constraint "data_obj_partial_subobjs_uid_fkey";
alter table "tsim"."data_obj_sequential" add constraint "data_obj_sequential_obj_nid_fkey" FOREIGN KEY (obj_nid) REFERENCES tsim.info_obj_sequential(obj_nid) not valid;
alter table "tsim"."data_obj_sequential" validate constraint "data_obj_sequential_obj_nid_fkey";
alter table "tsim"."data_obj_sequential" add constraint "data_obj_sequential_uid_fkey" FOREIGN KEY (uid) REFERENCES auth.users(id) ON DELETE CASCADE not valid;
alter table "tsim"."data_obj_sequential" validate constraint "data_obj_sequential_uid_fkey";
alter table "tsim"."info_achievement" add constraint "info_achievement_game_ach_tid_key" UNIQUE using index "info_achievement_game_ach_tid_key";
alter table "tsim"."info_obj_counter" add constraint "info_obj_counter_ach_nid_fkey" FOREIGN KEY (ach_nid) REFERENCES tsim.info_achievement(ach_nid) not valid;
alter table "tsim"."info_obj_counter" validate constraint "info_obj_counter_ach_nid_fkey";
alter table "tsim"."info_obj_counter" add constraint "info_obj_counter_ach_nid_obj_tid_key" UNIQUE using index "info_obj_counter_ach_nid_obj_tid_key";
alter table "tsim"."info_obj_list" add constraint "info_obj_list_ach_nid_fkey" FOREIGN KEY (ach_nid) REFERENCES tsim.info_achievement(ach_nid) not valid;
alter table "tsim"."info_obj_list" validate constraint "info_obj_list_ach_nid_fkey";
alter table "tsim"."info_obj_list" add constraint "info_obj_list_ach_nid_obj_tid_key" UNIQUE using index "info_obj_list_ach_nid_obj_tid_key";
alter table "tsim"."info_obj_list_subobjs" add constraint "info_obj_list_subobjs_obj_nid_fkey" FOREIGN KEY (obj_nid) REFERENCES tsim.info_obj_list(obj_nid) not valid;
alter table "tsim"."info_obj_list_subobjs" validate constraint "info_obj_list_subobjs_obj_nid_fkey";
alter table "tsim"."info_obj_list_subobjs" add constraint "info_obj_list_subobjs_obj_nid_subobj_tid_key" UNIQUE using index "info_obj_list_subobjs_obj_nid_subobj_tid_key";
alter table "tsim"."info_obj_partial" add constraint "info_obj_partial_ach_nid_fkey" FOREIGN KEY (ach_nid) REFERENCES tsim.info_achievement(ach_nid) not valid;
alter table "tsim"."info_obj_partial" validate constraint "info_obj_partial_ach_nid_fkey";
alter table "tsim"."info_obj_partial" add constraint "info_obj_partial_ach_nid_obj_tid_key" UNIQUE using index "info_obj_partial_ach_nid_obj_tid_key";
alter table "tsim"."info_obj_partial_subobjs" add constraint "info_obj_partial_subobjs_obj_nid_fkey" FOREIGN KEY (obj_nid) REFERENCES tsim.info_obj_partial(obj_nid) not valid;
alter table "tsim"."info_obj_partial_subobjs" validate constraint "info_obj_partial_subobjs_obj_nid_fkey";
alter table "tsim"."info_obj_partial_subobjs" add constraint "info_obj_partial_subobjs_obj_nid_subobj_tid_key" UNIQUE using index "info_obj_partial_subobjs_obj_nid_subobj_tid_key";
alter table "tsim"."info_obj_sequential" add constraint "info_obj_sequential_ach_nid_fkey" FOREIGN KEY (ach_nid) REFERENCES tsim.info_achievement(ach_nid) not valid;
alter table "tsim"."info_obj_sequential" validate constraint "info_obj_sequential_ach_nid_fkey";
alter table "tsim"."info_obj_sequential" add constraint "info_obj_sequential_ach_nid_obj_tid_key" UNIQUE using index "info_obj_sequential_ach_nid_obj_tid_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION tsim.data_counterobj_validation()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN CASE
    WHEN NEW.val < 0 THEN NULL
    WHEN NEW.val > (SELECT goal FROM tsim.info_obj_counter WHERE info_obj_counter.obj_nid = NEW.obj_nid) THEN NULL
    ELSE NEW END;
  END;
$function$;

CREATE OR REPLACE FUNCTION tsim.data_sequentialobj_validation()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN CASE
    WHEN NEW.current_step < 0 THEN NULL
    WHEN NEW.val > (SELECT number_of_steps FROM tsim.info_obj_sequential WHERE info_obj_sequential.obj_nid = NEW.obj_nid) THEN NULL
    ELSE NEW END;
END;
$function$;

CREATE OR REPLACE FUNCTION tsim.fn_update_lastupdated_ach_completed()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  v_game tsim.trucksim_game;
  v_uid UUID;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_uid := OLD.uid;
    SELECT game INTO v_game FROM tsim.info_achievement WHERE ach_nid = OLD.ach_nid;
  ELSE
    v_uid := NEW.uid;
    SELECT game INTO v_game FROM tsim.info_achievement WHERE ach_nid = NEW.ach_nid;
  END IF;

  INSERT INTO tsim.data_last_updated (uid, game, last_updated)
    VALUES (v_uid, v_game, now())
    ON CONFLICT (uid, game) DO UPDATE SET last_updated = now();

  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION tsim.fn_update_lastupdated_obj_counter()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  v_game tsim.trucksim_game;
  v_uid UUID;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_uid := OLD.uid;
    SELECT game INTO v_game FROM tsim.mv_info_obj_counter WHERE obj_nid = OLD.obj_nid;
  ELSE
    v_uid := NEW.uid;
    SELECT game INTO v_game FROM tsim.mv_info_obj_counter WHERE obj_nid = NEW.obj_nid;
  END IF;

  INSERT INTO tsim.data_last_updated (uid, game, last_updated) 
    VALUES (v_uid, v_game, now()) 
    ON CONFLICT (uid, game) DO UPDATE SET last_updated = now();

  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION tsim.fn_update_lastupdated_obj_list()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  v_game tsim.trucksim_game;
  v_uid UUID;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_uid := OLD.uid;
    SELECT game INTO v_game FROM tsim.mv_info_obj_list WHERE subobj_nid = OLD.subobj_nid;
  ELSE
    v_uid := NEW.uid;
    SELECT game INTO v_game FROM tsim.mv_info_obj_list WHERE subobj_nid = NEW.subobj_nid;
  END IF;

  INSERT INTO tsim.data_last_updated (uid, game, last_updated) 
    VALUES (v_uid, v_game, now()) 
    ON CONFLICT (uid, game) DO UPDATE SET last_updated = now();

  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION tsim.fn_update_lastupdated_obj_partial()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  v_game tsim.trucksim_game;
  v_uid UUID;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_uid := OLD.uid;
    SELECT game INTO v_game FROM tsim.mv_info_obj_partial WHERE subobj_nid = OLD.subobj_nid;
  ELSE
    v_uid := NEW.uid;
    SELECT game INTO v_game FROM tsim.mv_info_obj_partial WHERE subobj_nid = NEW.subobj_nid;
  END IF;

  INSERT INTO tsim.data_last_updated (uid, game, last_updated) 
    VALUES (v_uid, v_game, now()) 
    ON CONFLICT (uid, game) DO UPDATE SET last_updated = now();

  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION tsim.fn_update_lastupdated_obj_sequential()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  v_game tsim.trucksim_game;
  v_uid UUID;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_uid := OLD.uid;
    SELECT game INTO v_game FROM mv_info_obj_sequential WHERE obj_nid = OLD.obj_nid;
  ELSE
    v_uid := NEW.uid;
    SELECT game INTO v_game FROM mv_info_obj_sequential WHERE obj_nid = NEW.obj_nid;
  END IF;

  INSERT INTO tsim.data_last_updated (uid, game, last_updated) 
    VALUES (v_uid, v_game, now()) 
    ON CONFLICT (uid, game) DO UPDATE SET last_updated = now();

  RETURN NEW;
END;
$function$;

create materialized view "tsim"."mv_info_obj_counter" as  SELECT info_achievement.game,
    info_achievement.ach_tid,
    info_obj_counter.obj_nid,
    info_obj_counter.obj_tid
  FROM (tsim.info_obj_counter
    JOIN tsim.info_achievement ON ((info_obj_counter.ach_nid = info_achievement.ach_nid)));

create materialized view "tsim"."mv_info_obj_list" as
  SELECT info_achievement.game,
    info_achievement.ach_tid,
    info_obj_list.obj_tid,
    info_obj_list_subobjs.subobj_nid,
    info_obj_list_subobjs.obj_nid,
    info_obj_list_subobjs.subobj_tid
  FROM ((tsim.info_obj_list_subobjs
    JOIN tsim.info_obj_list ON ((info_obj_list_subobjs.obj_nid = info_obj_list.obj_nid)))
    JOIN tsim.info_achievement ON ((info_obj_list.ach_nid = info_achievement.ach_nid)));

create materialized view "tsim"."mv_info_obj_partial" as
  SELECT
    info_achievement.game,
    info_achievement.ach_tid,
    info_obj_partial.obj_tid,
    info_obj_partial_subobjs.subobj_nid,
    info_obj_partial_subobjs.obj_nid,
    info_obj_partial_subobjs.subobj_tid
  FROM ((tsim.info_obj_partial_subobjs
    JOIN tsim.info_obj_partial ON ((info_obj_partial_subobjs.obj_nid = info_obj_partial.obj_nid)))
    JOIN tsim.info_achievement ON ((info_obj_partial.ach_nid = info_achievement.ach_nid)));

create materialized view "tsim"."mv_info_obj_sequential" as
  SELECT 
    info_achievement.game,
    info_achievement.ach_tid,
    info_obj_sequential.obj_nid,
    info_obj_sequential.obj_tid
  FROM (tsim.info_obj_sequential
    JOIN tsim.info_achievement ON ((info_obj_sequential.ach_nid = info_achievement.ach_nid)));


CREATE INDEX mv_info_obj_counter_obj_nid_idx ON tsim.mv_info_obj_counter USING btree (obj_nid);
CREATE INDEX mv_info_obj_list_subobj_nid_idx ON tsim.mv_info_obj_list USING btree (subobj_nid);
CREATE INDEX mv_info_obj_partial_subobj_nid_idx ON tsim.mv_info_obj_partial USING btree (subobj_nid);
CREATE INDEX mv_info_obj_sequential_obj_nid_idx ON tsim.mv_info_obj_sequential USING btree (obj_nid);

CREATE ROLE "info";
CREATE ROLE "webserv";

grant select on all tables in schema "tsim" to "info", "webserv";

grant usage on schema "tsim" to "info";
grant insert, update, delete on table "tsim"."info_achievement" to "info";
grant insert, update, delete on table "tsim"."info_obj_counter" to "info";
grant insert, update, delete on table "tsim"."info_obj_list" to "info";
grant insert, update, delete on table "tsim"."info_obj_list_subobjs" to "info";
grant insert, update, delete on table "tsim"."info_obj_partial" to "info";
grant insert, update, delete on table "tsim"."info_obj_partial_subobjs" to "info";
grant insert, update, delete on table "tsim"."info_obj_sequential" to "info";

grant usage on schema "tsim" to "webserv";
grant insert, update, delete on table "tsim"."data_ach_completed" to "webserv";
grant insert, update, delete on table "tsim"."data_obj_counter" to "webserv";
grant insert, update, delete on table "tsim"."data_obj_list_subobjs" to "webserv";
grant insert, update, delete on table "tsim"."data_obj_partial_subobjs" to "webserv";
grant insert, update, delete on table "tsim"."data_obj_sequential" to "webserv";


CREATE TRIGGER tg_data_last_updated_ach_completed 
  AFTER INSERT OR DELETE OR UPDATE ON tsim.data_ach_completed
  FOR EACH ROW EXECUTE FUNCTION tsim.fn_update_lastupdated_ach_completed();
CREATE TRIGGER data_counterobj_validate_val 
  BEFORE INSERT OR UPDATE ON tsim.data_obj_counter
  FOR EACH ROW EXECUTE FUNCTION tsim.data_counterobj_validation();
CREATE TRIGGER tg_data_last_updated_obj_counter
  AFTER INSERT OR DELETE OR UPDATE ON tsim.data_obj_counter
  FOR EACH ROW EXECUTE FUNCTION tsim.fn_update_lastupdated_obj_counter();
CREATE TRIGGER tg_data_last_updated_obj_list
  AFTER INSERT OR DELETE OR UPDATE ON tsim.data_obj_list_subobjs
  FOR EACH ROW EXECUTE FUNCTION tsim.fn_update_lastupdated_obj_list();
CREATE TRIGGER tg_data_last_updated_obj_partial
  AFTER INSERT OR DELETE OR UPDATE ON tsim.data_obj_partial_subobjs
  FOR EACH ROW EXECUTE FUNCTION tsim.fn_update_lastupdated_obj_partial();
CREATE TRIGGER data_sequentialobj_validate_step
  BEFORE INSERT OR UPDATE ON tsim.data_obj_sequential
  FOR EACH ROW EXECUTE FUNCTION tsim.data_sequentialobj_validation();
CREATE TRIGGER tg_data_last_updated_obj_sequential
  AFTER INSERT OR DELETE OR UPDATE ON tsim.data_obj_sequential
  FOR EACH ROW EXECUTE FUNCTION tsim.fn_update_lastupdated_obj_sequential();