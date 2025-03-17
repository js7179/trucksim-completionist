import { LocalListObjective } from "@/components/objectives/ListObjective";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { ListSubobjectiveItem } from "trucksim-completionist-common";
import { useLocalStateAchievementListObj, useLocalFuncMarkListObj } from "@/hooks/LocalAchievementHooks";

const ACHID = 'foo';
const OBJID = 'bar';
const LIST_VALUES: ListSubobjectiveItem[] = [
    { subobjid: 'test', display: 'Test' }, 
    { subobjid: 'foo', display: 'Foo' }, 
    { subobjid: 'bar', display: 'Bar' }, 
];
const DISPATCH_MOCK = vi.fn();

const DEFAULT_PROPS = { values: LIST_VALUES, achID: ACHID, objid: OBJID };

vi.mock('@/hooks/LocalAchievementHooks', () => ({
    useLocalStateAchievementListObj: vi.fn(),
    useLocalFuncMarkListObj: vi.fn()
}));

describe('List objective', () => {
    beforeAll(() => {
        (useLocalStateAchievementListObj as vi.Mock).mockReturnValue([]);
        (useLocalFuncMarkListObj as vi.Mock).mockReturnValue(DISPATCH_MOCK);
    });

    afterEach(() => {
        vi.clearAllMocks();
    })

    it("renders normally, no interactivity", async () => {
        render(<LocalListObjective {...DEFAULT_PROPS} />);

        expect(screen.getByLabelText('Test')).not.toBeChecked();
        expect(screen.getByLabelText('Foo')).not.toBeChecked();
        expect(screen.getByLabelText('Bar')).not.toBeChecked();
    });

    it("renders normally, Bar checked off", async () => {
        (useLocalStateAchievementListObj as vi.Mock).mockReturnValueOnce(['bar']);

        render(<LocalListObjective {...DEFAULT_PROPS} />);

        expect(screen.getByLabelText('Test')).not.toBeChecked();
        expect(screen.getByLabelText('Foo')).not.toBeChecked();
        expect(screen.getByLabelText('Bar')).toBeChecked();
    });

    it("renders normally, check dispatch called", async () => {
        const user = userEvent.setup();

        render(<LocalListObjective {...DEFAULT_PROPS} />);

        const fooCheckbox = screen.getByLabelText('Foo');
        await user.click(fooCheckbox);

        expect(DISPATCH_MOCK).toHaveBeenCalledWith(ACHID, OBJID, 'foo', true);
    });
});