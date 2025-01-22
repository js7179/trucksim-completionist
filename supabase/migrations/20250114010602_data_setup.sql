-- Set up info tables
CREATE TYPE trucksim_game AS ENUM ('ets2', 'ats');

CREATE TABLE info_achievement(
			ach_nid SERIAL PRIMARY KEY, 
			ach_tid text NOT NULL, 
			game trucksim_game NOT NULL,
			UNIQUE(game, ach_tid)
);

CREATE SEQUENCE info_objnid_seq AS INTEGER MINVALUE 1 START WITH 1;

CREATE TABLE info_obj_counter(
	obj_nid INTEGER DEFAULT nextval('info_objnid_seq') PRIMARY KEY,
	ach_nid INTEGER REFERENCES info_achievement(ach_nid) NOT NULL,
	obj_tid TEXT NOT NULL,
	goal INTEGER NOT NULL,
	UNIQUE(ach_nid, obj_tid)
);


CREATE TABLE info_obj_list(
	obj_nid INTEGER DEFAULT nextval('info_objnid_seq') PRIMARY KEY,
	ach_nid INTEGER REFERENCES info_achievement NOT NULL,
	obj_tid TEXT NOT NULL,
	goal TEXT[] NOT NULL,
	UNIQUE(ach_nid, obj_tid)
);

-- Set up data tables

CREATE TABLE data_last_updated(
	uid UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
	ets2_timestamp TIMESTAMPTZ DEFAULT now(), 
	ats_timestamp TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE data_ach_completed(
	uid UUID REFERENCES auth.users(id) ON DELETE CASCADE,
	ach_nid INTEGER REFERENCES info_achievement(ach_nid),
	isCompleted BOOL DEFAULT FALSE NOT NULL,
	PRIMARY KEY(uid, ach_nid)
);

CREATE TABLE data_obj_counter(
	uid UUID REFERENCES auth.users(id) ON DELETE CASCADE,
	obj_nid INTEGER REFERENCES info_obj_counter(obj_nid),
	val INTEGER DEFAULT 0 NOT NULL,
	PRIMARY KEY(uid, obj_nid)
);

CREATE TABLE data_obj_list(
	uid UUID REFERENCES auth.users(id) ON DELETE CASCADE,
	obj_nid INTEGER REFERENCES info_obj_list(obj_nid),
	val TEXT[] DEFAULT ARRAY[]::text[] NOT NULL,
	PRIMARY KEY(uid, obj_nid)
);

-- Set up trigger to insert row on user creation
CREATE FUNCTION user_created_add_lastupdated() RETURNS TRIGGER AS $user_created_add_lastupdated$
	BEGIN
		INSERT INTO data_last_updated (uid) VALUES (NEW.id);
		RETURN NULL;
	END;
$user_created_add_lastupdated$ LANGUAGE plpgsql;

CREATE TRIGGER on_user_created_insert_lastupdated
	AFTER INSERT ON auth.users
	FOR EACH ROW EXECUTE FUNCTION user_created_add_lastupdated();

-- Set up timestamp trigger for databases
CREATE VIEW info_mapping_objnid_game AS 
	SELECT obj_nid, info_achievement.game 
		FROM info_obj_counter 
		JOIN info_achievement ON info_achievement.ach_nid=info_obj_counter.ach_nid 
	UNION 
	SELECT obj_nid, info_achievement.game
		FROM info_obj_list
		JOIN info_achievement ON info_achievement.ach_nid=info_obj_list.ach_nid;

CREATE OR REPLACE FUNCTION update_lastupdated() RETURNS TRIGGER AS $update_lastupdated$
	DECLARE
		game trucksim_game; 
	BEGIN
		IF TG_ARGV[0] = 'objid' THEN
			game := (SELECT info_mapping_objnid_game.game FROM info_mapping_objnid_game WHERE obj_nid=NEW.obj_nid);
		ELSIF TG_ARGV[0] = 'achid' THEN
			game := (SELECT info_achievement.game FROM info_achievement WHERE ach_nid=NEW.ach_nid);
		ELSE
			RAISE EXCEPTION 'Argument is unrecognized';
		END IF;
		IF game = 'ets2'::trucksim_game THEN
			UPDATE data_last_updated
				SET ets2_timestamp=now()
				WHERE uid=NEW.uid;
		ELSIF game = 'ats'::trucksim_game THEN
			UPDATE data_last_updated
				SET ats_timestamp=now()
				WHERE uid=NEW.uid;
		ELSE
			RAISE EXCEPTION 'Game is unrecognized';
		END IF;
		RETURN NEW;
	END;
$update_lastupdated$ LANGUAGE plpgsql;

CREATE TRIGGER data_obj_counter_updatets
	AFTER INSERT OR UPDATE ON data_obj_counter
	FOR EACH ROW EXECUTE FUNCTION update_lastupdated('objid');
	
CREATE TRIGGER data_obj_list_updatets
	AFTER INSERT OR UPDATE ON data_obj_list
	FOR EACH ROW EXECUTE FUNCTION update_lastupdated('objid');
	
CREATE TRIGGER data_ach_completed_updatets
	AFTER INSERT OR UPDATE ON data_ach_completed
	FOR EACH ROW EXECUTE FUNCTION update_lastupdated('achid');
	
-- Set up validation functions
--		List validation
CREATE FUNCTION data_listobj_validation() RETURNS TRIGGER AS $data_listobj_validation$
	BEGIN
		RETURN CASE
			WHEN NEW.val <@ (SELECT goal FROM info_obj_list WHERE obj_nid=NEW.obj_nid) THEN NEW
			ELSE NULL END;
	END;
$data_listobj_validation$ LANGUAGE plpgsql;

CREATE TRIGGER data_listobj_validate_val
	BEFORE INSERT OR UPDATE ON data_obj_list
	FOR EACH ROW EXECUTE FUNCTION data_listobj_validation();
	
--		Counter validation
CREATE FUNCTION data_counterobj_validation() RETURNS TRIGGER AS $data_counterobj_validation$
	BEGIN
		RETURN CASE
			WHEN NEW.val < 0 THEN NULL
			WHEN NEW.val > (SELECT goal FROM info_obj_counter WHERE obj_nid=NEW.obj_nid) THEN NULL
			ELSE NEW END;
	END;
$data_counterobj_validation$ LANGUAGE plpgsql;

CREATE TRIGGER data_counterobj_validate_val
	BEFORE INSERT OR UPDATE ON data_obj_counter
	FOR EACH ROW EXECUTE FUNCTION data_counterobj_validation();

-- Permissions
CREATE ROLE infomanager;
CREATE ROLE webserv;

CREATE USER webserv1 WITH PASSWORD 'webserv1' IN ROLE webserv;
CREATE USER infomanager WITH PASSWORD 'infomanager' IN ROLE infomanager;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO infomanager, webserv;
GRANT INSERT, UPDATE, DELETE ON data_last_updated, data_ach_completed, data_obj_counter, data_obj_list TO webserv;
GRANT INSERT, UPDATE, DELETE ON info_achievement, info_obj_counter, info_obj_list TO infomanager;