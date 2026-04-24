-- Info manager
CREATE ROLE info;

GRANT USAGE ON SCHEMA tsim TO info;
GRANT INSERT, UPDATE, DELETE ON 
    tsim.info_achievement,
    tsim.info_obj_list,
    tsim.info_obj_list_subobjs,
    tsim.info_obj_counter,
    tsim.info_obj_sequential,
    tsim.info_obj_partial,
    tsim.info_obj_partial_subobjs 
    TO info;
GRANT USAGE, SELECT, UPDATE ON SEQUENCE tsim.info_objnid_seq TO info;
ALTER DEFAULT PRIVILEGES IN SCHEMA tsim GRANT MAINTAIN ON TABLES TO info;

-- Web server
CREATE ROLE webserv;

GRANT USAGE ON SCHEMA tsim TO webserv;
GRANT INSERT, UPDATE, DELETE ON 
    tsim.data_ach_completed,
    tsim.data_obj_counter,
    tsim.data_obj_sequential,
    tsim.data_obj_list_subobjs,
    tsim.data_obj_partial_subobjs 
TO webserv;

-- Global permissions
GRANT SELECT ON ALL TABLES IN SCHEMA tsim TO info, webserv;