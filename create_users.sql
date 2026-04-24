CREATE USER "webserv1" WITH PASSWORD 'webserv1' IN ROLE "webserv";
CREATE USER "infomanager" WITH PASSWORD 'infomanager' IN ROLE "webserv";

ALTER ROLE "webserv1" SET search_path TO "tsim";
ALTER ROLE "infomanager" SET search_path TO "tsim";