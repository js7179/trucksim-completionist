import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SendPasswordResetForm from '@/components/auth/SendPasswordResetForm';
import { useAuth } from '@/hooks/Auth';

const VALID_EMAIL: string = "test@example.com";
const INVALID_EMAIL: string = '@.';

const mockSendPWReset = vi.fn();

beforeAll(() => {
    (useAuth as jest.Mock).mockReturnValue({ sendPasswordReset: mockSendPWReset });
});

afterEach(() => {
    mockSendPWReset.mockClear();
});

describe('Send password reset form', () => {
    it('Renders with fields', async () => {
        render(<SendPasswordResetForm />);

        expect(screen.getByLabelText("Email")).toBeInTheDocument();
        expect(screen.getByText("Send Password Reset Email")).toBeInTheDocument();
    });

    it('Show success dialog on password reset sent', async () => { 
        const user = userEvent.setup();
        render(<SendPasswordResetForm />);

        const emailInput = screen.getByLabelText("Email");
        const submitButton = screen.getByText("Send Password Reset Email");

        await user.type(emailInput, VALID_EMAIL);
        await user.click(submitButton);

        expect(emailInput).toHaveValue(VALID_EMAIL);
        
        expect(mockSendPWReset).toHaveBeenCalledTimes(1);
        expect(mockSendPWReset).toHaveBeenCalledWith(VALID_EMAIL);

        const confirmationDialogue = screen.getByText('A password reset email', { exact: false });
        expect(confirmationDialogue).toBeInTheDocument();
        expect(confirmationDialogue.textContent).toMatch(VALID_EMAIL); // verify email is within confirmation dialog
    });

    it('Error on missing email', async () => {
        const user = userEvent.setup();
        render(<SendPasswordResetForm />);
        
        const emailInput = screen.getByLabelText("Email");
        const submitButton = screen.getByText("Send Password Reset Email");

        await user.click(emailInput);
        await user.click(submitButton);

        expect(emailInput).toHaveValue('');
        expect(mockSendPWReset).toHaveBeenCalledTimes(0);
        expect(screen.getByText(/Email is required/)).toBeInTheDocument();
    });

    it('Error on invalid email', async () => {
        const user = userEvent.setup();
        render(<SendPasswordResetForm />);
        
        const emailInput = screen.getByLabelText("Email");
        const submitButton = screen.getByText("Send Password Reset Email");

        await user.type(emailInput, INVALID_EMAIL);
        await user.click(submitButton);

        expect(emailInput).toHaveValue(INVALID_EMAIL);
        expect(mockSendPWReset).toHaveBeenCalledTimes(0);
        expect(screen.getByText(/Email must be a valid email address/)).toBeInTheDocument();
    });
});