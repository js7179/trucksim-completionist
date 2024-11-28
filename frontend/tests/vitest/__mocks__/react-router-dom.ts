const mockNavigate = vi.fn();

vi.mock(import('react-router-dom'), async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});