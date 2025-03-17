import { VisualCounterObjective } from "@/components/objectives/CounterObjective";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';

const ACHID = 'foobar';
const OBJID = 'sample';
const GOAL = 5;
const DISPLAY_TEXT = 'Sample Counter';
const DISPATCH_MOCK = vi.fn();

describe('Counter objective', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders normally, default state", () => {
        const current_count = 0;

        render(<VisualCounterObjective display={DISPLAY_TEXT} goal={GOAL} objid={OBJID} achID={ACHID} current={current_count} func={DISPATCH_MOCK} />);

        expect(screen.getByText(DISPLAY_TEXT)).toBeInTheDocument();
        expect(screen.getByText(`${current_count} / ${GOAL}`)).toBeInTheDocument();
        expect(screen.getByText('+', { selector: 'button' })).toBeInTheDocument();
        expect(screen.getByText('-', { selector: 'button' })).toBeInTheDocument();
    });

    it("renders normally, different count", () => {
        const current_count = 4;

        render(<VisualCounterObjective display={DISPLAY_TEXT} goal={GOAL} objid={OBJID} achID={ACHID} current={current_count} func={DISPATCH_MOCK} />);

        expect(screen.getByText(DISPLAY_TEXT)).toBeInTheDocument();
        expect(screen.getByText(`${current_count} / ${GOAL}`)).toBeInTheDocument();
        expect(screen.getByText('+', { selector: 'button' })).toBeInTheDocument();
        expect(screen.getByText('-', { selector: 'button' })).toBeInTheDocument();
    });

    it("decrement button clicked, dispatch called with -1", async () => {
        const user = userEvent.setup();
        const current_count = 0;

        render(<VisualCounterObjective display={DISPLAY_TEXT} goal={GOAL} objid={OBJID} achID={ACHID} current={current_count} func={DISPATCH_MOCK} />);

        const decrement_button = screen.getByText('-', { selector: 'button' });
        await user.click(decrement_button);

        expect(DISPATCH_MOCK).toHaveBeenCalledWith(-1);
    });

    it("increment button clicked, dispatch called with +1", async () => {
        const user = userEvent.setup();
        const current_count = 0;

        render(<VisualCounterObjective display={DISPLAY_TEXT} goal={GOAL} objid={OBJID} achID={ACHID} current={current_count} func={DISPATCH_MOCK} />);

        const decrement_button = screen.getByText('+', { selector: 'button' });
        await user.click(decrement_button);

        expect(DISPATCH_MOCK).toHaveBeenCalledWith(+1);
    });
});
