-- Info tables
CREATE TABLE tsim.info_obj_partial(
    obj_nid INTEGER DEFAULT nextval('tsim.info_objnid_seq') PRIMARY KEY,
    ach_nid INTEGER REFERENCES tsim.info_achievement(ach_nid) NOT NULL,
    obj_tid TEXT NOT NULL,
    goal_count INTEGER NOT NULL,
    UNIQUE(ach_nid, obj_tid)
);

CREATE TABLE tsim.info_obj_partial_subobjs(
    subobj_nid INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    obj_nid INTEGER REFERENCES tsim.info_obj_partial NOT NULL,
    subobj_tid TEXT NOT NULL,
    UNIQUE(obj_nid, subobj_tid)
);

-- Data tables
CREATE TABLE tsim.data_obj_partial_subobjs(
    uid UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subobj_nid INTEGER REFERENCES tsim.info_obj_partial_subobjs NOT NULL,
    PRIMARY KEY(uid, subobj_nid)
);

-- Validation
-- Not needed