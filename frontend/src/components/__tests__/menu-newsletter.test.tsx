import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResponsiveContext } from 'grommet';
import { Menu } from '../menu';

// Mock the Newsletter component
jest.mock('../newsletter/newsletter', () => ({
  Newsletter: ({ setShowNewsletter }: { setShowNewsletter: (show: boolean) => void }) => (
    <div data-testid="newsletter-component">
      <button data-testid="mock-cancel-button" onClick={() => setShowNewsletter(false)}>
        CANCEL
      </button>
    </div>
  ),
}));

describe('Menu', () => {
  describe('Desktop view', () => {
    const renderDesktopMenu = () => {
      return render(
        <ResponsiveContext.Provider value="medium">
          <Menu />
        </ResponsiveContext.Provider>
      );
    };

    it('renders menu links when newsletter is not shown', () => {
      renderDesktopMenu();

      // Check that navigation items are displayed
      expect(screen.getByText('JOURNAL')).toBeInTheDocument();
      expect(screen.getByText('ABOUT')).toBeInTheDocument();
      expect(screen.getByText('SUBMIT')).toBeInTheDocument();

      // Check for newsletter link
      expect(screen.getByText('NEWSLETTER')).toBeInTheDocument();

      // Newsletter component should not be visible
      expect(screen.queryByTestId('newsletter-component')).not.toBeInTheDocument();
    });

    it('shows newsletter when newsletter link is clicked', () => {
      renderDesktopMenu();

      // Find and click the newsletter link
      const newsletterLink = screen.getByText('NEWSLETTER');
      fireEvent.click(newsletterLink);

      // Newsletter component should now be visible
      expect(screen.getByTestId('newsletter-component')).toBeInTheDocument();

      // Navigation items should not be visible
      expect(screen.queryByText('JOURNAL')).not.toBeInTheDocument();
      expect(screen.queryByText('ABOUT')).not.toBeInTheDocument();
      expect(screen.queryByText('SUBMIT')).not.toBeInTheDocument();
      expect(screen.queryByText('NEWSLETTER')).not.toBeInTheDocument();
    });

    it('hides newsletter when cancel button is clicked', () => {
      renderDesktopMenu();

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
      expect(screen.getByText('ABOUT')).toBeInTheDocument();
      expect(screen.getByText('SUBMIT')).toBeInTheDocument();
      expect(screen.getByText('NEWSLETTER')).toBeInTheDocument();
    });
  });

  describe('Mobile view', () => {
    const renderMobileMenu = () => {
      return render(
        <ResponsiveContext.Provider value="small">
          <Menu />
        </ResponsiveContext.Provider>
      );
    };

    it('renders mobile view with menu icon and no menu items', () => {
      renderMobileMenu();

      // Brand should be visible
      expect(screen.getByText('YUZZI')).toBeInTheDocument();

      // Menu icon should be visible (using role button since it's a Button with an icon)
      expect(screen.getByRole('button')).toBeInTheDocument();

      // Navigation items should not be visible
      expect(screen.queryByText('JOURNAL')).not.toBeInTheDocument();
      expect(screen.queryByText('ABOUT')).not.toBeInTheDocument();
      expect(screen.queryByText('SUBMIT')).not.toBeInTheDocument();
      expect(screen.queryByText('NEWSLETTER')).not.toBeInTheDocument();

      // Newsletter should not be visible
      expect(screen.queryByTestId('newsletter-component')).not.toBeInTheDocument();
    });

    //TODO: Sidebar functionality is yet to be done
    // it('shows sidebar when menu button is clicked', () => {
    //   renderMobileMenu();
    //   const menuButton = screen.getByRole('button');
    //   fireEvent.click(menuButton);
    //   expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    // });
  });
});
