import { ListObjectiveInfo } from "trucksim-completionist-common";
import SubobjList from './SubobjList';

export default function LocalListObjective({achID, objid, values}: ListObjectiveProps) {
    return (
        <SubobjList achID={achID} objid={objid} values={values} />
    );
}

export interface ListObjectiveProps extends Omit<ListObjectiveInfo, "type"> {
    achID: string;
}