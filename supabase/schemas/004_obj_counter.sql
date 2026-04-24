-- Info tables
CREATE TABLE tsim.info_obj_counter(
	obj_nid INTEGER DEFAULT nextval('tsim.info_objnid_seq') PRIMARY KEY,
	ach_nid INTEGER REFERENCES tsim.info_achievement(ach_nid) NOT NULL,
	obj_tid TEXT NOT NULL,
	goal INTEGER NOT NULL,
	UNIQUE(ach_nid, obj_tid)
);

-- Data tables
CREATE TABLE tsim.data_obj_counter(
	uid UUID REFERENCES auth.users(id) ON DELETE CASCADE,
	obj_nid INTEGER REFERENCES tsim.info_obj_counter(obj_nid),
	val INTEGER DEFAULT 0 NOT NULL,
	PRIMARY KEY(uid, obj_nid)
);

-- Validation
CREATE OR REPLACE FUNCTION tsim.data_counterobj_validation() 
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
	BEGIN
		RETURN CASE
			WHEN NEW.val < 0 THEN NULL
			WHEN NEW.val > (SELECT goal FROM tsim.info_obj_counter WHERE info_obj_counter.obj_nid = NEW.obj_nid) THEN NULL
			ELSE NEW END;
	END;
$$;

CREATE OR REPLACE TRIGGER data_counterobj_validate_val
	BEFORE INSERT OR UPDATE ON tsim.data_obj_counter
	FOR EACH ROW EXECUTE FUNCTION tsim.data_counterobj_validation();