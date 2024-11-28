vi.mock('@/hooks/Auth', () => ({
    useAuth: vi.fn(() => ({
        session: null,
        loading: false,
        signUp: vi.fn(),
        login: vi.fn(),
        sendPasswordReset: vi.fn(),
        setNewPassword: vi.fn(),
        signOut: vi.fn(),
    })),
}));