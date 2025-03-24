jest.mock('@/components/ui/videomodal', () => ({
  VideoStackPlayer: () => <div data-testid="video-player">Mocked</div>,
}));
jest.mock('@/lib/data');

import '@testing-library/jest-dom';
import Home from '../page';
import * as dataModule from '@/lib/data';

describe('Home Server Component', () => {
  it('contains expected content after server rendering', async () => {
    // Setup mock data
    (dataModule.getFeatureFilm as jest.Mock).mockResolvedValue({
      film: { title: 'LUTTE JEUNESSE' },
      content: 'Test content',
    });

    // For Next.js 15.2, use the experimental jest-next package or React's streaming render
    // This is a simplified example - you may need to adapt based on your setup
    const HomeComponent = await Home();

    // Verify component output contains expected content
    // This is a very basic check - you may need a more sophisticated approach
    const output = JSON.stringify(HomeComponent);
    expect(output).toContain('LUTTE JEUNESSE');
  });
});
