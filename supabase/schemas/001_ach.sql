CREATE SCHEMA tsim;

CREATE TYPE tsim.trucksim_game AS ENUM ('ets2', 'ats');

-- Info table
CREATE TABLE tsim.info_achievement(
    ach_nid INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, 
    ach_tid text NOT NULL, 
    game tsim.trucksim_game NOT NULL,
    UNIQUE(game, ach_tid)
);

CREATE SEQUENCE tsim.info_objnid_seq AS INTEGER MINVALUE 1;

-- Data table
CREATE TABLE tsim.data_ach_completed(
	uid UUID REFERENCES auth.users(id) ON DELETE CASCADE,
	ach_nid INTEGER REFERENCES tsim.info_achievement(ach_nid),
	is_completed BOOLEAN DEFAULT FALSE NOT NULL,
	PRIMARY KEY(uid, ach_nid)
);