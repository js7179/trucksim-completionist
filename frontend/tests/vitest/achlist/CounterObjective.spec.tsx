import { VisualCounterObjective } from "@/components/objectives/CounterObjective";
import { screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import renderWithMantine from "../util/render";

const ACHID = 'foobar';
const OBJID = 'sample';
const GOAL = 5;
const DISPLAY_TEXT = 'Sample Counter';
const DISPATCH_MOCK = vi.fn();

function getCounterButtons() {
    return {
        incrementBtn: screen.getByRole('button', { name: 'Increment' }),
        decrementBtn: screen.getByRole('button', { name: 'Decrement' }),
    };
}

describe('Counter objective', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders normally, default state", () => {
        const current_count = 0;

        renderWithMantine(<VisualCounterObjective display={DISPLAY_TEXT} goal={GOAL} objid={OBJID} achID={ACHID} current={current_count} func={DISPATCH_MOCK} />);

        const { incrementBtn, decrementBtn } = getCounterButtons();

        expect(screen.getByText(DISPLAY_TEXT)).toBeInTheDocument();
        expect(screen.getByText(`${current_count} / ${GOAL}`)).toBeInTheDocument();
        expect(incrementBtn).toBeInTheDocument();
        expect(decrementBtn).toBeInTheDocument();
    });

    it("renders normally, different count", () => {
        const current_count = 4;

        renderWithMantine(<VisualCounterObjective display={DISPLAY_TEXT} goal={GOAL} objid={OBJID} achID={ACHID} current={current_count} func={DISPATCH_MOCK} />);

        const { incrementBtn, decrementBtn } = getCounterButtons();

        expect(screen.getByText(DISPLAY_TEXT)).toBeInTheDocument();
        expect(screen.getByText(`${current_count} / ${GOAL}`)).toBeInTheDocument();
        expect(incrementBtn).toBeInTheDocument();
        expect(decrementBtn).toBeInTheDocument();
    });

    it("decrement button clicked, dispatch called with -1", async () => {
        const user = userEvent.setup();
        const current_count = 0;

        renderWithMantine(<VisualCounterObjective display={DISPLAY_TEXT} goal={GOAL} objid={OBJID} achID={ACHID} current={current_count} func={DISPATCH_MOCK} />);

        const { decrementBtn } = getCounterButtons();
        await user.click(decrementBtn);

        expect(DISPATCH_MOCK).toHaveBeenCalledWith(-1);
    });

    it("increment button clicked, dispatch called with +1", async () => {
        const user = userEvent.setup();
        const current_count = 0;

        renderWithMantine(<VisualCounterObjective display={DISPLAY_TEXT} goal={GOAL} objid={OBJID} achID={ACHID} current={current_count} func={DISPATCH_MOCK} />);

        const { incrementBtn } = getCounterButtons();
        await user.click(incrementBtn);

        expect(DISPATCH_MOCK).toHaveBeenCalledWith(+1);
    });
});
