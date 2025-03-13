import { ListObjectiveInfo } from "trucksim-completionist-common";
import { LocalSubobjList, RemoteSubobjList } from './SubobjList';

export function LocalListObjective({achID, objid, values}: ListObjectiveProps) {
    return (
        <LocalSubobjList achID={achID} objid={objid} values={values} />
    );
}

export function RemoteListObjective({achID, objid, values}: ListObjectiveProps) {
    return (
        <RemoteSubobjList values={values} objid={objid} achID={achID} />
    );
}

export type ListObjectiveProps = Omit<ListObjectiveInfo, "type"> & { achID: string; };