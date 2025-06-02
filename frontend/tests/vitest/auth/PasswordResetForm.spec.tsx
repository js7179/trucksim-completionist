import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { useNavigate } from 'react-router';
import { renderWithMemoryRouterAndMantine } from '../util/render';

const VALID_PASSWORD: string = '12345678';
const INVALID_PASSWORD: string = '1234'; // 4 char does not meet 8 char requirement

const mockSetNewPassword = vi.fn();

function getFormControls() {
    return {
        newPasswordInput: screen.getByLabelText(/(?<!Confirm\s+)New\s+Password/),
        confirmPasswordInput: screen.getByLabelText("Confirm New Password", { exact: false }),
        submitButton: screen.getByRole('button', { name: "Change Password" })
    };
}

vi.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({
        setNewPassword: mockSetNewPassword
    })
}));

describe('Password Reset form', () => {
    afterEach(() => {
        mockSetNewPassword.mockClear();
    })
    
    it('Renders with fields', async () => {
        renderWithMemoryRouterAndMantine(<ResetPasswordForm />);

        const { newPasswordInput, confirmPasswordInput, submitButton } = getFormControls();

        expect(newPasswordInput).toBeInTheDocument();
        expect(confirmPasswordInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
    });

    it('Error on missing password', async () => {
        const user = userEvent.setup();
        const navigate = useNavigate();
        renderWithMemoryRouterAndMantine(<ResetPasswordForm />);

        const { newPasswordInput, confirmPasswordInput, submitButton } = getFormControls();

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
        renderWithMemoryRouterAndMantine(<ResetPasswordForm />);

        const { newPasswordInput, confirmPasswordInput, submitButton } = getFormControls();

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
        renderWithMemoryRouterAndMantine(<ResetPasswordForm />);

        const { newPasswordInput, confirmPasswordInput, submitButton } = getFormControls();

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
        renderWithMemoryRouterAndMantine(<ResetPasswordForm />);

        const { newPasswordInput, confirmPasswordInput, submitButton } = getFormControls();

        await user.type(newPasswordInput, VALID_PASSWORD);
        await user.type(confirmPasswordInput, VALID_PASSWORD);
        await user.click(submitButton);

        expect(newPasswordInput).toHaveValue(VALID_PASSWORD);
        expect(confirmPasswordInput).toHaveValue(VALID_PASSWORD);

        const confirmationDialogue = screen.getByText('Your password has been reset!', { exact: false });
        expect(confirmationDialogue).toBeInTheDocument();

        await waitFor(() => {
            expect(navigate).toHaveBeenCalledTimes(1);
            expect(navigate).toHaveBeenCalledWith('/');
        }, { timeout: 7 * 1_000});
    }, 10 * 1_000); // set timeout to 10s to capture 5s-delayed navigate()
});