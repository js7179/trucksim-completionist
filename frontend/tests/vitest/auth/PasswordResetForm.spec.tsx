import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { useAuth } from '@/hooks/Auth';
import { MemoryRouter, useNavigate } from 'react-router-dom';

const VALID_PASSWORD: string = '12345678';
const INVALID_PASSWORD: string = '1234'; // 4 char does not meet 8 char requirement

const mockSetNewPassword = vi.fn();

beforeAll(() => {
    (useAuth as jest.Mock).mockReturnValue({ setNewPassword: mockSetNewPassword });
});

afterEach(() => {
    vi.clearAllMocks();
});

function renderPWResetForm() {
    render(<ResetPasswordForm/>, {
        wrapper: ({children}) => (
            <MemoryRouter initialEntries={["/"]}>
                {children}
            </MemoryRouter>
        )
    });
}

describe('Password Reset form', () => {
    it('Renders with fields', async () => {
        renderPWResetForm();

        expect(screen.getByLabelText("New Password")).toBeInTheDocument();
        expect(screen.getByLabelText("Confirm New Password")).toBeInTheDocument();
        expect(screen.getByText("Change Password")).toBeInTheDocument();
    });

    it('Error on missing password', async () => {
        const user = userEvent.setup();
        const navigate = useNavigate();
        renderPWResetForm();

        const newPasswordInput = screen.getByLabelText("New Password");
        const confirmPasswordInput = screen.getByLabelText("Confirm New Password");
        const submitButton = screen.getByText("Change Password");

        await user.click(newPasswordInput);
        await user.type(confirmPasswordInput, VALID_PASSWORD);
        await user.click(submitButton);

        expect(newPasswordInput).not.toHaveValue();
        expect(confirmPasswordInput).toHaveValue(VALID_PASSWORD);

        expect(screen.getByText(/Password is required/)).toBeInTheDocument();
        expect(navigate).toHaveBeenCalledTimes(0);
    });

    it('Error on invalid password', async () => {
        const user = userEvent.setup();
        const navigate = useNavigate();
        renderPWResetForm();

        const newPasswordInput = screen.getByLabelText("New Password");
        const confirmPasswordInput = screen.getByLabelText("Confirm New Password");
        const submitButton = screen.getByText("Change Password");

        await user.type(newPasswordInput, INVALID_PASSWORD);
        await user.type(confirmPasswordInput, INVALID_PASSWORD);
        await user.click(submitButton);

        expect(newPasswordInput).toHaveValue(INVALID_PASSWORD);
        expect(confirmPasswordInput).toHaveValue(INVALID_PASSWORD);

        expect(screen.getByText(/Password must be at least 8 characters long/)).toBeInTheDocument();
        expect(navigate).toHaveBeenCalledTimes(0);
    });

    it('Error on invalid confirmation password', async () => {
        const user = userEvent.setup();
        const navigate = useNavigate();
        renderPWResetForm();

        const newPasswordInput = screen.getByLabelText("New Password");
        const confirmPasswordInput = screen.getByLabelText("Confirm New Password");
        const submitButton = screen.getByText("Change Password");

        await user.type(newPasswordInput, VALID_PASSWORD);
        await user.type(confirmPasswordInput, INVALID_PASSWORD);
        await user.click(submitButton);

        expect(newPasswordInput).toHaveValue(VALID_PASSWORD);
        expect(confirmPasswordInput).toHaveValue(INVALID_PASSWORD);

        expect(screen.getByText(/Passwords do not match/)).toBeInTheDocument();
        expect(navigate).toHaveBeenCalledTimes(0);
    });

    it('Show success dialog on password reset sent', async () => {
        const user = userEvent.setup();
        const navigate = useNavigate();
        renderPWResetForm();

        const newPasswordInput = screen.getByLabelText("New Password");
        const confirmPasswordInput = screen.getByLabelText("Confirm New Password");
        const submitButton = screen.getByText("Change Password");

        await user.type(newPasswordInput, VALID_PASSWORD);
        await user.type(confirmPasswordInput, VALID_PASSWORD);
        await user.click(submitButton);

        expect(newPasswordInput).toHaveValue(VALID_PASSWORD);
        expect(confirmPasswordInput).toHaveValue(VALID_PASSWORD);

        const confirmationDialogue = screen.getByText('Your password has been set!', { exact: false });
        expect(confirmationDialogue).toBeInTheDocument();

        await waitFor(() => {
            expect(navigate).toHaveBeenCalledTimes(1);
            expect(navigate).toHaveBeenCalledWith('/');
        }, { timeout: 7 * 1_000});
    }, 10 * 1_000); // set timeout to 10s to capture 5s-delayed navigate()
});