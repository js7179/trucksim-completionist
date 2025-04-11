import { render, screen } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import SignupForm from '@/components/auth/SignupForm';
import { useAuth } from '@/hooks/Auth';

const VALID_EMAIL: string = 'test@example.com';
const VALID_PASSWORD: string = 'password12345';
const VALID_DISPLAY_NAME: string = 'TestUser123';
const INVALID_EMAIL: string = '@.';
const INVALID_DISPLAY_NAME: string = '1234567890123456789012'; // 22 char exceeds 20 char limit
const INVALID_PASSWORD: string = '1234'; // 4 char does not meet 8 char requirement

const mockSignup = vi.fn();

beforeAll(() => {
    (useAuth as jest.Mock).mockReturnValue({ signUp: mockSignup });
});

afterEach(() => {
    mockSignup.mockClear();
});

function getFormControls () {
    return {
        emailInput: screen.getByLabelText("Email"),
        displayNameInput: screen.getByLabelText("Display Name"),
        passwordInput: screen.getByLabelText("Password"),
        passwordConfirmationInput: screen.getByLabelText("Confirm Password"),
        submitButton: screen.getByText("Sign Up")
    };
}

type FormInput = ReturnType<typeof screen.getByLabelText>;
type FormControl = ReturnType<typeof screen.getByText>;

type FormInputs = {
    emailInput: FormInput;
    displayNameInput: FormInput;
    passwordInput: FormInput;
    passwordConfirmationInput: FormInput;
    submitButton: FormControl;
};

type FormValues = {
    email: string;
    displayName: string;
    password: string;
    confirmPassword: string;
}

async function fieldInput(user: UserEvent, field: FormInput, value: string) {
    if(value === '') {
        await user.click(field);
    } else {
        await user.type(field, value);
    }
}

async function performInputs(user: UserEvent, inputs: FormInputs, values: FormValues) {
    await fieldInput(user, inputs.emailInput, values.email);
    await fieldInput(user, inputs.displayNameInput, values.displayName);
    await fieldInput(user, inputs.passwordInput, values.password);
    await fieldInput(user, inputs.passwordConfirmationInput, values.confirmPassword);
    await user.click(inputs.submitButton);
}

const VALID_FORM_FIELD_VALUES: FormValues = {
    email: VALID_EMAIL,
    displayName: VALID_DISPLAY_NAME,
    password: VALID_PASSWORD,
    confirmPassword: VALID_PASSWORD
};

describe('Sign up form', () => {
    it('Renders with fields', async () => {
        render(<SignupForm />);

        const { emailInput, displayNameInput, passwordInput, passwordConfirmationInput, submitButton } = getFormControls();

        // Validate form fields exist in document
        expect(emailInput).toBeInTheDocument();
        expect(displayNameInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(passwordConfirmationInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
    });

    it('Show success dialog on sign-in', async () => {      
        const user = userEvent.setup();
        render(<SignupForm />);

        const formControls = getFormControls();

        await performInputs(user, formControls, VALID_FORM_FIELD_VALUES);

        expect(formControls.emailInput).toHaveValue(VALID_EMAIL);
        expect(formControls.displayNameInput).toHaveValue(VALID_DISPLAY_NAME);
        expect(formControls.passwordInput).toHaveValue(VALID_PASSWORD);
        expect(formControls.passwordConfirmationInput).toHaveValue(VALID_PASSWORD);

        expect(mockSignup).toHaveBeenCalledTimes(1);
        expect(mockSignup).toHaveBeenCalledWith(VALID_EMAIL, VALID_PASSWORD, VALID_DISPLAY_NAME);

        const confirmationDialogue = screen.getByText('verification email', { exact: false });
        expect(confirmationDialogue).toBeInTheDocument();
        expect(confirmationDialogue.textContent).toMatch(VALID_EMAIL); // verify email is within confirmation dialog
    });

    it('Error on missing email', async () => {
        const user = userEvent.setup();
        render(<SignupForm />);

        const formControls = getFormControls();

        await performInputs(user, formControls, {...VALID_FORM_FIELD_VALUES, email: ''});

        expect(formControls.emailInput).not.toHaveValue();
        expect(formControls.displayNameInput).toHaveValue(VALID_DISPLAY_NAME);
        expect(formControls.passwordInput).toHaveValue(VALID_PASSWORD);
        expect(formControls.passwordConfirmationInput).toHaveValue(VALID_PASSWORD);

        expect(mockSignup).toHaveBeenCalledTimes(0);
        expect(screen.getByText(/Email address is required/)).toBeInTheDocument();
    });

    it('Error on missing display name', async () => {
        const user = userEvent.setup();
        render(<SignupForm />);

        const formInputs = getFormControls();

        await performInputs(user, formInputs, {...VALID_FORM_FIELD_VALUES, displayName: ''});

        expect(formInputs.emailInput).toHaveValue(VALID_EMAIL);
        expect(formInputs.displayNameInput).not.toHaveValue();;
        expect(formInputs.passwordInput).toHaveValue(VALID_PASSWORD);
        expect(formInputs.passwordConfirmationInput).toHaveValue(VALID_PASSWORD);

        expect(mockSignup).toHaveBeenCalledTimes(0);
        expect(screen.getByText(/Display Name is required/)).toBeInTheDocument();
    });

    it('Error on missing password', async () => {
        const user = userEvent.setup();
        render(<SignupForm />);

        const formControls = getFormControls();

        await performInputs(user, formControls, {...VALID_FORM_FIELD_VALUES, password: ''});

        expect(formControls.emailInput).toHaveValue(VALID_EMAIL);
        expect(formControls.displayNameInput).toHaveValue(VALID_DISPLAY_NAME);
        expect(formControls.passwordInput).not.toHaveValue();;
        expect(formControls.passwordConfirmationInput).toHaveValue(VALID_PASSWORD);

        expect(mockSignup).toHaveBeenCalledTimes(0);
        expect(screen.getByText(/Password is required/)).toBeInTheDocument();
    });

    it('Error on missing confirm password', async () => {
        const user = userEvent.setup();
        render(<SignupForm />);

        const formControls = getFormControls();

        await performInputs(user, formControls, {...VALID_FORM_FIELD_VALUES, confirmPassword: ''});

        expect(formControls.emailInput).toHaveValue(VALID_EMAIL);
        expect(formControls.displayNameInput).toHaveValue(VALID_DISPLAY_NAME);
        expect(formControls.passwordInput).toHaveValue(VALID_PASSWORD);
        expect(formControls.passwordConfirmationInput).not.toHaveValue();;

        expect(mockSignup).toHaveBeenCalledTimes(0);
        expect(screen.getByText(/Passwords do not match/)).toBeInTheDocument();
    });

    it('Error on invalid email', async () => {
        const user = userEvent.setup();
        render(<SignupForm />);

        const formControls = getFormControls();

        await performInputs(user, formControls, {...VALID_FORM_FIELD_VALUES, email: INVALID_EMAIL});

        expect(formControls.emailInput).toHaveValue(INVALID_EMAIL);
        expect(formControls.displayNameInput).toHaveValue(VALID_DISPLAY_NAME);
        expect(formControls.passwordInput).toHaveValue(VALID_PASSWORD);
        expect(formControls.passwordConfirmationInput).toHaveValue(VALID_PASSWORD);

        expect(mockSignup).toHaveBeenCalledTimes(0);
        expect(screen.getByText(/Email address must be a valid email/)).toBeInTheDocument();
    });

    it('Error on invalid display name', async () => {
        const user = userEvent.setup();
        render(<SignupForm />);

        const formControls = getFormControls();

        await performInputs(user, formControls, {...VALID_FORM_FIELD_VALUES, displayName: INVALID_DISPLAY_NAME});

        expect(formControls.emailInput).toHaveValue(VALID_EMAIL);
        expect(formControls.displayNameInput).toHaveValue(INVALID_DISPLAY_NAME);
        expect(formControls.passwordInput).toHaveValue(VALID_PASSWORD);
        expect(formControls.passwordConfirmationInput).toHaveValue(VALID_PASSWORD);

        expect(mockSignup).toHaveBeenCalledTimes(0);
        expect(screen.getByText(/Display Name cannot be longer than 20 characters/)).toBeInTheDocument();
    });

    it('Error on invalid password', async () => {
        const user = userEvent.setup();
        render(<SignupForm />);

        const formControls = getFormControls();

        await performInputs(user, formControls, {...VALID_FORM_FIELD_VALUES, password: INVALID_PASSWORD, confirmPassword: INVALID_PASSWORD});

        expect(formControls.emailInput).toHaveValue(VALID_EMAIL);
        expect(formControls.displayNameInput).toHaveValue(VALID_DISPLAY_NAME);
        expect(formControls.passwordInput).toHaveValue(INVALID_PASSWORD);
        expect(formControls.passwordConfirmationInput).toHaveValue(INVALID_PASSWORD);

        expect(mockSignup).toHaveBeenCalledTimes(0);
        expect(screen.getByText(/Password must be at least 8 characters long/)).toBeInTheDocument();
    });
});