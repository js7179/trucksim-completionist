import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/hooks/Auth';

const VALID_PASSWORD: string = 'password12345';
const INVALID_EMAIL: string = '@.';
const VALID_EMAIL: string = 'test@example.com';

const mockLogin = vi.fn();

beforeAll(() => {
    (useAuth as jest.Mock).mockReturnValue({ login: mockLogin });
});

afterEach(() => {
    mockLogin.mockClear();
});

describe('Login Form', () => {
    it('Renders normally', () => {
        render(<LoginForm />);

        // Validate form fields exist in document
        expect(screen.getByLabelText("Email")).toBeInTheDocument();
        expect(screen.getByLabelText("Password")).toBeInTheDocument();
        expect(screen.getByText("Login")).toBeInTheDocument();
    });

    it('Show success dialog on sign-in', async () => {
        const user = userEvent.setup();

        render(<LoginForm />);

        const emailInput = screen.getByLabelText("Email");
        const passwordInput = screen.getByLabelText("Password");
        const submitButton = screen.getByText("Login");

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

        render(<LoginForm />);

        const emailInput = screen.getByLabelText("Email");
        const passwordInput = screen.getByLabelText("Password");
        const submitButton = screen.getByText("Login");

        await user.click(emailInput);
        await user.click(passwordInput);
        await user.keyboard(VALID_PASSWORD);
        await user.click(submitButton);

        expect(mockLogin).not.toHaveBeenCalled();
        expect(emailInput).not.toHaveValue();;
        expect(passwordInput).toHaveValue(VALID_PASSWORD);
        expect(screen.getByText(/Email is required/)).toBeInTheDocument();
    });

    it('Invalid email format', async () => {
        const user = userEvent.setup();

        render(<LoginForm />);

        const emailInput = screen.getByLabelText("Email");
        const passwordInput = screen.getByLabelText("Password");
        const submitButton = screen.getByText("Login");

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

        render(<LoginForm />);

        const emailInput = screen.getByLabelText("Email");
        const passwordInput = screen.getByLabelText("Password");
        const submitButton = screen.getByText("Login");

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