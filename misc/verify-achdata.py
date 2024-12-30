import sys
import json

def checkJson(data):
    issues = 0
    achid_check = set()
    for achievement in data:
        if 'id' not in achievement:
            issues += 1
            print(f'Could not find specific achID for {achievement}')
            continue

        achid = achievement['id']
        if achid in achid_check:
            issues += 1
            print(f'Conflict with achID {achid}')
        else:
            achid_check.add(achid)
        if len(achievement['objectives']) == 0:
            continue
        objid_check = set()
        for objective in achievement['objectives']:
            if 'objid' not in objective:
                issues += 1
                print(f'Missing objid for one of {achid}\'s objective')
                continue
            objid = objective['objid']
            if objid in objid_check:
                issues += 1
                print(f'Conflict with objid {objid} for achID {achid}')
            else:
                objid_check.add(objid)
            
            if objective['type'] == 'counter':
                continue

            subobjid_check = set()
            if 'values' not in objective:
                issues += 1
                print(f'Values missing for a list/counter obj achID={achid} objID={objid}')
                continue
            for subobj in objective['values']:
                if 'subobjid' not in subobj:
                    issues += 1
                    print(f'Subobjid missing for a list/counter obj item achID={achid} objID={objid}')
                    continue
                subobjid = subobj['subobjid']
                if subobjid in subobjid_check:
                    issues += 1
                    print(f'Conflict with subobjids {subobjid} in {achid}\'s {objid}')
                else:
                    subobjid_check.add(subobjid)
    return issues

def main():
    if len(sys.argv) != 2:
        print('Expecting .json argument!', file=sys.stderr)
        exit(1)
    
    filename = sys.argv[1]
    data = None
    with open(filename, 'r', encoding='utf8') as fs:
        data = json.load(fs)

    nIssues = checkJson(data)
    if nIssues == 0:
        print('No issues found!')
        exit(0)
    else:
        print(f'{nIssues} issues found! Consult program output above')
        exit(1)

if __name__ == '__main__':
    main()