import { ListObjectiveInfo, ListSubobjectiveItem } from "trucksim-completionist-common";
import { Checkbox, SimpleGrid } from "@mantine/core";

export default function SubobjList({achID, objid, values, current, func}: SubobjListProps) {
    const listItems = values.map((subobj: ListSubobjectiveItem) => {
        const inputID = `${achID}.${objid}.${subobj.subobjid}`;
        const isChecked = current.includes(subobj.subobjid);
        return (
            <Checkbox
                key={inputID}
                checked={isChecked}
                label={subobj.display}
                onChange={() => func(subobj.subobjid)}
                color='gray' />
        );
    });

    return (
        <SimpleGrid cols={{base: 1, sm: 2, md: 3, lg: 4}} p='md'>
            {...listItems}
        </SimpleGrid>
    );
}

export type SubobjListProps = Omit<ListObjectiveInfo, "type"> & {
    achID: string; 
    current: string[];
    func: (subobjid: string) => void;
 };