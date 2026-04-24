-- Counter objective
CREATE MATERIALIZED VIEW tsim.mv_info_obj_counter AS
    SELECT info_achievement.game, 
            info_achievement.ach_tid, 
            info_obj_counter.obj_nid,
            info_obj_counter.obj_tid
        FROM tsim.info_obj_counter
        JOIN tsim.info_achievement ON info_obj_counter.ach_nid = tsim.info_achievement.ach_nid;

CREATE INDEX ON tsim.mv_info_obj_counter (obj_nid);

-- Sequential objective
CREATE MATERIALIZED VIEW tsim.mv_info_obj_sequential AS
    SELECT info_achievement.game, 
            info_achievement.ach_tid, 
            info_obj_sequential.obj_nid, 
            info_obj_sequential.obj_tid
        FROM tsim.info_obj_sequential
        JOIN tsim.info_achievement ON info_obj_sequential.ach_nid = info_achievement.ach_nid;

CREATE INDEX ON tsim.mv_info_obj_sequential (obj_nid);

-- List objective
CREATE MATERIALIZED VIEW tsim.mv_info_obj_list AS
    SELECT info_achievement.game,
            info_achievement.ach_tid,
            info_obj_list.obj_tid,
            info_obj_list_subobjs.subobj_nid,
            info_obj_list_subobjs.obj_nid,
            info_obj_list_subobjs.subobj_tid
        FROM tsim.info_obj_list_subobjs
        JOIN tsim.info_obj_list ON info_obj_list_subobjs.obj_nid = info_obj_list.obj_nid
        JOIN tsim.info_achievement ON info_obj_list.ach_nid = info_achievement.ach_nid;

CREATE INDEX ON tsim.mv_info_obj_list (subobj_nid);

-- Partial objective
CREATE MATERIALIZED VIEW tsim.mv_info_obj_partial AS
    SELECT info_achievement.game,
            info_achievement.ach_tid,
            info_obj_partial.obj_tid,
            info_obj_partial_subobjs.subobj_nid,
            info_obj_partial_subobjs.obj_nid,
            info_obj_partial_subobjs.subobj_tid
        FROM tsim.info_obj_partial_subobjs
        JOIN tsim.info_obj_partial ON info_obj_partial_subobjs.obj_nid = info_obj_partial.obj_nid
        JOIN tsim.info_achievement ON info_obj_partial.ach_nid = info_achievement.ach_nid;

CREATE INDEX ON tsim.mv_info_obj_partial (subobj_nid);