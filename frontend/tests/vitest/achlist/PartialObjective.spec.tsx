
import { VisualPartialObjective } from "@/components/objectives/PartialObjective";
import { screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { ListSubobjectiveItem } from "trucksim-completionist-common";
import renderWithMantine from "../util/render";

const ACHID = 'foo';
const OBJID = 'bar';
const GOAL = 3;
const VALUES: ListSubobjectiveItem[] = [
    { display: 'Alpha', subobjid: 'aaa' },
    { display: 'Bravo', subobjid: 'bbb' },
    { display: 'Charlie', subobjid: 'ccc' },
    { display: 'Delta', subobjid: 'ddd' },
    { display: 'Echo', subobjid: 'eee' }
];
const DISPATCH_MOCK = vi.fn();

describe("Partial objective", () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders normally, default state", () => {
        const current_state: string[] = [];

        renderWithMantine(<VisualPartialObjective count={GOAL} values={VALUES} objid={OBJID} achID={ACHID} current={current_state} func={DISPATCH_MOCK} />);

        expect(screen.getByLabelText('Alpha')).not.toBeChecked();
        expect(screen.getByLabelText('Bravo')).not.toBeChecked();
        expect(screen.getByLabelText('Charlie')).not.toBeChecked();
        expect(screen.getByLabelText('Delta')).not.toBeChecked();
        expect(screen.getByLabelText('Echo')).not.toBeChecked();
        expect(screen.getByText(`${current_state.length}/${GOAL}`)).toBeInTheDocument();
    });

    it("renders normally, meets goal with extra", () => {
        const current_state: string[] = ['aaa', 'bbb', 'ccc', 'eee'];

        renderWithMantine(<VisualPartialObjective count={GOAL} values={VALUES} objid={OBJID} achID={ACHID} current={current_state} func={DISPATCH_MOCK} />);

        expect(screen.getByLabelText('Alpha')).toBeChecked();
        expect(screen.getByLabelText('Bravo')).toBeChecked();
        expect(screen.getByLabelText('Charlie')).toBeChecked();
        expect(screen.getByLabelText('Delta')).not.toBeChecked();
        expect(screen.getByLabelText('Echo')).toBeChecked();
        expect(screen.getByText(`3/${GOAL}`)).toBeInTheDocument();
    });

    it("Bravo clicked, dispatch called with subobjid", async () => {
        const user = userEvent.setup();
        const current_state: string[] = [];

        renderWithMantine(<VisualPartialObjective count={GOAL} values={VALUES} objid={OBJID} achID={ACHID} current={current_state} func={DISPATCH_MOCK} />);

        const bravo = screen.getByLabelText('Bravo');
        await user.click(bravo);

        expect(DISPATCH_MOCK).toHaveBeenCalledWith('bbb');
    });

    it("Delta clicked, dispatch called with subobjid", async () => {
        const user = userEvent.setup();
        const current_state: string[] = [];

        renderWithMantine(<VisualPartialObjective count={GOAL} values={VALUES} objid={OBJID} achID={ACHID} current={current_state} func={DISPATCH_MOCK} />);

        const delta = screen.getByLabelText('Delta');
        await user.click(delta);

        expect(DISPATCH_MOCK).toHaveBeenCalledWith('ddd');
    });
});