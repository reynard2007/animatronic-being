import React from 'react';
import { render } from '@testing-library/react';
import Board from './Board';

describe('Board', () => {
  test('should render properly', () => {
    const { getAllByTestId } = render(<Board />);

    expect(getAllByTestId('square')).toHaveLength(25);
  });
});
