import { ListObjectiveInfo } from "trucksim-completionist-common";
import SubobjList from './SubobjList';

export function LocalListObjective({achID, objid, values}: ListObjectiveProps) {
    return (
        <SubobjList achID={achID} objid={objid} values={values} />
    );
}

export function RemoteListObjective({achID, objid, values}: ListObjectiveProps) {
    return (<p>To be implemented</p>);
}

export interface ListObjectiveProps extends Omit<ListObjectiveInfo, "type"> {
    achID: string;
}