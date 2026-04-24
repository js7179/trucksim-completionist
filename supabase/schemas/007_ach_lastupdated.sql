CREATE TABLE tsim.data_last_updated(
	uid UUID REFERENCES auth.users(id) ON DELETE CASCADE,
	game tsim.trucksim_game, 
	last_updated TIMESTAMPTZ DEFAULT now(),
	PRIMARY KEY(uid, game)
);

-- Achievement completed
CREATE OR REPLACE FUNCTION tsim.fn_update_lastupdated_ach_completed()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tg_data_last_updated_ach_completed
	AFTER INSERT OR UPDATE OR DELETE ON tsim.data_ach_completed
	FOR EACH ROW EXECUTE FUNCTION tsim.fn_update_lastupdated_ach_completed();

-- List objective
CREATE OR REPLACE FUNCTION tsim.fn_update_lastupdated_obj_list()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tg_data_last_updated_obj_list 
	AFTER INSERT OR UPDATE OR DELETE ON tsim.data_obj_list_subobjs 
	FOR EACH ROW EXECUTE FUNCTION tsim.fn_update_lastupdated_obj_list();

-- Partial objective
CREATE OR REPLACE FUNCTION tsim.fn_update_lastupdated_obj_partial()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tg_data_last_updated_obj_partial
	AFTER INSERT OR UPDATE OR DELETE ON tsim.data_obj_partial_subobjs 
	FOR EACH ROW EXECUTE FUNCTION tsim.fn_update_lastupdated_obj_partial();

-- Counter objective
CREATE OR REPLACE FUNCTION tsim.fn_update_lastupdated_obj_counter()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tg_data_last_updated_obj_counter
	AFTER INSERT OR UPDATE OR DELETE ON tsim.data_obj_counter
	FOR EACH ROW EXECUTE FUNCTION tsim.fn_update_lastupdated_obj_counter();

-- Sequential objective
CREATE OR REPLACE FUNCTION tsim.fn_update_lastupdated_obj_sequential()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tg_data_last_updated_obj_sequential
	AFTER INSERT OR UPDATE OR DELETE ON tsim.data_obj_sequential
	FOR EACH ROW EXECUTE FUNCTION tsim.fn_update_lastupdated_obj_sequential();
