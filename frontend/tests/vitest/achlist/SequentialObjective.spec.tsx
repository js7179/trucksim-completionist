import { VisualSequentialObjective } from "@/components/objectives/SequentialObjective";
import { screen, within } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { ListSubobjectiveItem } from "trucksim-completionist-common";
import renderWithMantine from "../util/render";

const ACHID = 'foo';
const OBJID = 'bar';
const VALUES: ListSubobjectiveItem[] = [
    { subobjid: "aaa", display: "Step 1" },
    { subobjid: "bbb", display: "Step 2" },
    { subobjid: "ccc", display: "Step 3" },
    { subobjid: "ddd", display: "Step 4" },
    { subobjid: "eee", display: "Step 5" },
];
const DISPATCH_MOCK = vi.fn();

describe("Sequential objective", () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders normally, default state", () => {
        const current_step = 0;

        renderWithMantine(<VisualSequentialObjective values={VALUES} objid={OBJID} achID={ACHID} current={current_step} func={DISPATCH_MOCK} />);

        const ol = screen.getByRole('list');
        expect(ol).toBeInTheDocument();

        const orderedList = screen.getAllByRole('listitem');
        expect(orderedList).toHaveLength(VALUES.length);

        orderedList.forEach((liElement, index) => {
            const checkbox = within(liElement).getByRole('checkbox');
            const label = within(liElement).getByLabelText(VALUES[index].display);
            
            expect(checkbox).not.toBeChecked();
            expect(label).toBeInTheDocument();
        });
    });

    it("renders normally, goal state", () => {
        const current_step = 5;

        renderWithMantine(<VisualSequentialObjective values={VALUES} objid={OBJID} achID={ACHID} current={current_step} func={DISPATCH_MOCK} />);

        const ol = screen.getByRole('list');
        expect(ol).toBeInTheDocument();

        const orderedList = screen.getAllByRole('listitem');
        expect(orderedList).toHaveLength(VALUES.length);

        orderedList.forEach((liElement, index) => {
            const checkbox = within(liElement).getByRole('checkbox');
            const label = within(liElement).getByLabelText(VALUES[index].display);
            
            expect(checkbox).toBeChecked();
            expect(label).toBeInTheDocument();
        });
    });

    it("blank state, Step 2 clicked, dispatch called with 2", async () => {
        const user = userEvent.setup();
        const current_step = 0;

        renderWithMantine(<VisualSequentialObjective values={VALUES} objid={OBJID} achID={ACHID} current={current_step} func={DISPATCH_MOCK} />);

        const stepButton = screen.getByLabelText('Step 2');
        await user.click(stepButton);

        expect(DISPATCH_MOCK).toHaveBeenCalledWith(2);
    });

    it("step 5, Step 5 clicked, dispatch called with 5", async () => {
        const user = userEvent.setup();
        const current_step = 5;

        renderWithMantine(<VisualSequentialObjective values={VALUES} objid={OBJID} achID={ACHID} current={current_step} func={DISPATCH_MOCK} />);

        const stepButton = screen.getByLabelText('Step 5');
        await user.click(stepButton);

        expect(DISPATCH_MOCK).toHaveBeenCalledWith(5);
    });
})