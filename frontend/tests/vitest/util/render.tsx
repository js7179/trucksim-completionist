import { render as testingLibraryRender } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import theme from '../../../src/theme';
import { MemoryRouter } from 'react-router';

export default function renderWithMantine(ui: React.ReactNode) {
    return testingLibraryRender(<>{ui}</>, {
        wrapper: ({ children }: { children: React.ReactNode }) => (
            <MantineProvider theme={theme}>
                {children}
            </MantineProvider>
    ),
  });
}

export function renderWithMemoryRouterAndMantine(ui: React.ReactNode) {
    return testingLibraryRender(<>{ui}</>, {
        wrapper: ({ children }: { children: React.ReactNode }) => (
            <MemoryRouter initialEntries={["/"]}>
                <MantineProvider theme={theme}>
                    {children}
                </MantineProvider>
            </MemoryRouter>
    ),
  });
}