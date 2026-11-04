import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ComingSoonBadge } from './ComingSoonBadge';

describe('ComingSoonBadge', () => {
  it('announces the feature as coming soon and never shrinks in a row', () => {
    render(<ComingSoonBadge className="ml-auto" />);
    expect(screen.getByText('Em breve')).toHaveClass('shrink-0', 'ml-auto');
  });
});
