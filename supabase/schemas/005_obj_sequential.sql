-- Info tables
CREATE TABLE tsim.info_obj_sequential(
	obj_nid INTEGER DEFAULT nextval('tsim.info_objnid_seq') PRIMARY KEY,
	ach_nid INTEGER REFERENCES tsim.info_achievement NOT NULL,
	obj_tid TEXT NOT NULL,
	number_of_steps INTEGER NOT NULL,
	UNIQUE(ach_nid, obj_tid)
);

-- Data tables
CREATE TABLE tsim.data_obj_sequential(
	uid UUID REFERENCES auth.users(id) ON DELETE CASCADE,
	obj_nid INTEGER REFERENCES tsim.info_obj_sequential(obj_nid),
	current_step INTEGER DEFAULT 0,
	PRIMARY KEY (uid, obj_nid)
);

-- Validation
CREATE FUNCTION tsim.data_sequentialobj_validation() 
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
	BEGIN
		RETURN CASE
			WHEN NEW.current_step < 0 THEN NULL
			WHEN NEW.val > (SELECT number_of_steps FROM tsim.info_obj_sequential WHERE info_obj_sequential.obj_nid = NEW.obj_nid) THEN NULL
			ELSE NEW END;
	END;
$$;

CREATE OR REPLACE TRIGGER data_sequentialobj_validate_step
	BEFORE INSERT OR UPDATE ON tsim.data_obj_sequential
	FOR EACH ROW EXECUTE FUNCTION tsim.data_sequentialobj_validation();