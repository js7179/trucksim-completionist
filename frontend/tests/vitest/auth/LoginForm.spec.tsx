import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '@/components/auth/LoginForm';
import renderWithMantine from '../util/render';

const VALID_PASSWORD: string = 'password12345';
const INVALID_EMAIL: string = '@.';
const VALID_EMAIL: string = 'test@example.com';

const mockLogin = vi.fn();

vi.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({
        login: mockLogin
    })
}));

function getFormControls() {
    return {
        emailInput: screen.getByLabelText("Email", { exact: false }),
        passwordInput: screen.getByLabelText("Password", { exact: false }),
        submitButton: screen.getByRole('button', { name: 'Login' })
    };
}

describe('Login Form', () => {
    afterEach(() => {
        mockLogin.mockClear();
    });

    it('Renders normally', () => {
        renderWithMantine(<LoginForm />);

        const { emailInput, passwordInput, submitButton } = getFormControls();

        // Validate form fields exist in document
        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
    });

    it('Show success dialog on sign-in', async () => {
        const user = userEvent.setup();

        renderWithMantine(<LoginForm />);
        
        const { emailInput, passwordInput, submitButton } = getFormControls();

        await user.click(emailInput);
        await user.keyboard(VALID_EMAIL);
        await user.click(passwordInput);
        await user.keyboard(VALID_PASSWORD);
        await user.click(submitButton);

        expect(mockLogin).toHaveBeenCalledTimes(1);
        expect(mockLogin).toHaveBeenCalledWith(VALID_EMAIL, VALID_PASSWORD);

        expect(screen.getByText(/Logged in!/)).toBeInTheDocument();
    });

    it('Blank email', async () => {
        const user = userEvent.setup();

        renderWithMantine(<LoginForm />);

        const { emailInput, passwordInput, submitButton } = getFormControls();

        await user.click(emailInput);
        await user.click(passwordInput);
        await user.keyboard(VALID_PASSWORD);
        await user.click(submitButton);

        expect(mockLogin).not.toHaveBeenCalled();
        expect(emailInput).not.toHaveValue();
        expect(passwordInput).toHaveValue(VALID_PASSWORD);
        expect(screen.getByText(/Email is required/)).toBeInTheDocument();
    });

    it('Invalid email format', async () => {
        const user = userEvent.setup();

        renderWithMantine(<LoginForm />);

        const { emailInput, passwordInput, submitButton } = getFormControls();
        
        await user.click(emailInput);
        await user.keyboard(INVALID_EMAIL);
        await user.click(passwordInput);
        await user.keyboard(VALID_PASSWORD);
        await user.click(submitButton);

        expect(mockLogin).not.toHaveBeenCalled();
        expect(emailInput).toHaveValue(INVALID_EMAIL);
        expect(passwordInput).toHaveValue(VALID_PASSWORD);
        expect(screen.getByText(/Email must be a valid email address/)).toBeInTheDocument();
    });

    it('Blank password', async () => {
        const user = userEvent.setup();

        renderWithMantine(<LoginForm />);

        const { emailInput, passwordInput, submitButton } = getFormControls();
        
        await user.click(emailInput);
        await user.keyboard(VALID_EMAIL);
        await user.click(passwordInput);
        await user.click(submitButton);

        expect(mockLogin).not.toHaveBeenCalled();
        expect(emailInput).toHaveValue(VALID_EMAIL);
        expect(passwordInput).not.toHaveValue();;
        expect(screen.getByText(/Password is required/)).toBeInTheDocument();
    });
});