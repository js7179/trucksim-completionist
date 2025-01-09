import { ListObjectiveInfo } from "trucksim-completionist-common";
import SubobjList from './SubobjList';

export default function ListObjective({achID, objid, values}: ListObjectiveProps) {
    return (
        <SubobjList achID={achID} objid={objid} values={values} />
    );
}

interface ListObjectiveProps extends Omit<ListObjectiveInfo, "type"> {
    achID: string;
}