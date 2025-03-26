import { render, screen, fireEvent } from '@testing-library/react';
import { Menu } from '../menu';
import { Newsletter } from '../newsletter/newsletter';
import { ResponsiveContext } from 'grommet';
import * as React from 'react';

// Mock the Newsletter component
jest.mock('../newsletter/newsletter', () => ({
  Newsletter: jest.fn(({ setShowNewsletter }) => (
    <div data-testid="newsletter-component">
      <button onClick={() => setShowNewsletter(false)} data-testid="mock-cancel-button">
        CANCEL
      </button>
    </div>
  )),
}));

// Mock the next/link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock the Layer component from grommet
jest.mock('grommet', () => {
  const originalModule = jest.requireActual('grommet');
  return {
    ...originalModule,
    Layer: jest.fn(({ children }) => <div data-testid="sidebar-layer">{children}</div>),
  };
});

describe('NavBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Newsletter as jest.Mock).mockClear();
  });

  describe('Desktop view', () => {
    const renderDesktopNavBar = () => {
      return render(
        <ResponsiveContext.Provider value="medium">
          <Menu />
        </ResponsiveContext.Provider>
      );
    };

    it('renders navigation links when newsletter is not shown', () => {
      renderDesktopNavBar();

      // Check that navigation items are displayed
      expect(screen.getByText('JOURNAL')).toBeInTheDocument();
      expect(screen.getByText('ARCHIVES')).toBeInTheDocument();
      expect(screen.getByText('ABOUT')).toBeInTheDocument();
      expect(screen.getByText('SHOP')).toBeInTheDocument();

      // Check for newsletter link
      expect(screen.getByText('NEWSLETTER')).toBeInTheDocument();

      // Newsletter component should not be visible
      expect(screen.queryByTestId('newsletter-component')).not.toBeInTheDocument();
    });

    it('shows newsletter when newsletter link is clicked', () => {
      renderDesktopNavBar();

      // Find and click the newsletter link
      const newsletterLink = screen.getByText('NEWSLETTER');
      fireEvent.click(newsletterLink);

      // Newsletter component should now be visible
      expect(screen.getByTestId('newsletter-component')).toBeInTheDocument();

      // Navigation items should not be visible
      expect(screen.queryByText('JOURNAL')).not.toBeInTheDocument();
      expect(screen.queryByText('ARCHIVES')).not.toBeInTheDocument();
      expect(screen.queryByText('ABOUT')).not.toBeInTheDocument();
      expect(screen.queryByText('SHOP')).not.toBeInTheDocument();
      expect(screen.queryByText('NEWSLETTER')).not.toBeInTheDocument();
    });

    it('hides newsletter when cancel button is clicked', () => {
      renderDesktopNavBar();

      // Show newsletter first
      const newsletterLink = screen.getByText('NEWSLETTER');
      fireEvent.click(newsletterLink);

      // Verify newsletter is shown
      expect(screen.getByTestId('newsletter-component')).toBeInTheDocument();

      // Click cancel button on newsletter
      const cancelButton = screen.getByTestId('mock-cancel-button');
      fireEvent.click(cancelButton);

      // Newsletter should be hidden
      expect(screen.queryByTestId('newsletter-component')).not.toBeInTheDocument();

      // Navigation items should be visible again
      expect(screen.getByText('JOURNAL')).toBeInTheDocument();
      expect(screen.getByText('ARCHIVES')).toBeInTheDocument();
      expect(screen.getByText('ABOUT')).toBeInTheDocument();
      expect(screen.getByText('SHOP')).toBeInTheDocument();
      expect(screen.getByText('NEWSLETTER')).toBeInTheDocument();
    });
  });

  describe('Mobile view', () => {
    const renderMobileNavBar = () => {
      return render(
        <ResponsiveContext.Provider value="small">
          <Menu />
        </ResponsiveContext.Provider>
      );
    };

    it('renders mobile view with menu icon and no navigation items', () => {
      renderMobileNavBar();

      // Brand should be visible
      expect(screen.getByText('LE YUZZI')).toBeInTheDocument();

      // Menu icon should be visible (using role button since it's a Button with an icon)
      expect(screen.getByRole('button')).toBeInTheDocument();

      // Navigation items should not be visible
      expect(screen.queryByText('JOURNAL')).not.toBeInTheDocument();
      expect(screen.queryByText('ARCHIVES')).not.toBeInTheDocument();
      expect(screen.queryByText('ABOUT')).not.toBeInTheDocument();
      expect(screen.queryByText('SHOP')).not.toBeInTheDocument();
      expect(screen.queryByText('NEWSLETTER')).not.toBeInTheDocument();

      // Newsletter should not be visible
      expect(screen.queryByTestId('newsletter-component')).not.toBeInTheDocument();
    });

    //TODO: Sidebar functionality is yet to be done
    // it('shows sidebar when menu button is clicked', () => {
    //   renderMobileNavBar();

    //   // Click menu button
    //   const menuButton = screen.getByRole('button');
    //   fireEvent.click(menuButton);

    //   // Check for the sidebar layer using our testid
    //   expect(screen.getByTestId('sidebar-layer')).toBeInTheDocument();
    // });

    it('never shows newsletter in mobile view due to useEffect', () => {
      renderMobileNavBar();

      // Newsletter should not be visible in mobile view
      expect(screen.queryByTestId('newsletter-component')).not.toBeInTheDocument();
    });
  });

  it('renders brand link that logs on click', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    render(
      <ResponsiveContext.Provider value="medium">
        <Menu />
      </ResponsiveContext.Provider>
    );

    // Find and click the brand link
    const brandLink = screen.getByText('LE YUZZI');
    fireEvent.click(brandLink);

    // Check that console.log was called with 'CLICK'
    expect(consoleSpy).toHaveBeenCalledWith('CLICK');

    // Clean up
    consoleSpy.mockRestore();
  });
});
