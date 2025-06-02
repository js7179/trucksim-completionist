import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SendPasswordResetForm from '@/components/auth/SendPasswordResetForm';
import renderWithMantine from '../util/render';

const VALID_EMAIL: string = "test@example.com";
const INVALID_EMAIL: string = '@.';

const mockSendPWReset = vi.fn();

vi.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({
        sendPasswordReset: mockSendPWReset
    })
}));

function getFormControls() {
    return {
        emailInput: screen.getByLabelText('Email', { exact: false }),
        submitButton: screen.getByRole('button', { name: 'Send Password Reset Email' })
    };
}

describe('Send password reset form', () => {
    afterEach(() => {
        mockSendPWReset.mockClear();
    });

    it('Renders with fields', async () => {
        renderWithMantine(<SendPasswordResetForm />);

        const { emailInput, submitButton } = getFormControls();

        expect(emailInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
    });

    it('Show success dialog on password reset sent', async () => { 
        const user = userEvent.setup();
        renderWithMantine(<SendPasswordResetForm />);

        const { emailInput, submitButton } = getFormControls();

        await user.type(emailInput, VALID_EMAIL);
        await user.click(submitButton);

        expect(emailInput).toHaveValue(VALID_EMAIL);
        
        expect(mockSendPWReset).toHaveBeenCalledTimes(1);
        expect(mockSendPWReset).toHaveBeenCalledWith(VALID_EMAIL);

        const confirmationDialogue = screen.getByText('A password reset request', { exact: false });
        expect(confirmationDialogue).toBeInTheDocument();
        expect(confirmationDialogue.textContent).toMatch(VALID_EMAIL); // verify email is within confirmation dialog
    });

    it('Error on missing email', async () => {
        const user = userEvent.setup();
        renderWithMantine(<SendPasswordResetForm />);
        
        const { emailInput, submitButton } = getFormControls();

        await user.click(emailInput);
        await user.click(submitButton);

        expect(emailInput).not.toHaveValue();;
        expect(mockSendPWReset).toHaveBeenCalledTimes(0);
        expect(screen.getByText(/Email is required/)).toBeInTheDocument();
    });

    it('Error on invalid email', async () => {
        const user = userEvent.setup();
        renderWithMantine(<SendPasswordResetForm />);
        
        const { emailInput, submitButton } = getFormControls();

        await user.type(emailInput, INVALID_EMAIL);
        await user.click(submitButton);

        expect(emailInput).toHaveValue(INVALID_EMAIL);
        expect(mockSendPWReset).toHaveBeenCalledTimes(0);
        expect(screen.getByText(/Email must be a valid email address/)).toBeInTheDocument();
    });
});