import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import TableTop from './TableTop';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

describe('TableTop', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  test('should render properly', () => {
    const {
      container,
      getByPlaceholderText,
      getByText,
      queryByLabelText,
    } = render(<TableTop />);

    expect(getByPlaceholderText('Commands go here')).toBeInTheDocument();
    expect(getByText('Execute')).toBeInTheDocument();
    expect(queryByLabelText('Toy robot')).not.toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  test('should show robot on PLACE', () => {
    const { getByPlaceholderText, getByText, getByLabelText } = render(
      <TableTop />
    );

    act(() => {
      userEvent.paste(
        getByPlaceholderText('Commands go here'),
        'PLACE 3,2,SOUTH'
      );
      fireEvent.click(getByText('Execute'));
    });

    expect(getByLabelText('Toy robot')).toBeInTheDocument();
  });

  describe('should report correct value', () => {
    test.each([
      [
        `PLACE 3,4,SOUTH
          RIGHT
          RIGHT
          RIGHT
          RIGHT
          MOVE
          movE
          mOvE
          move
          move
          Move
          MOVE
          movE
          mOvE
          move
          move
          Move
          REPORT`,
        '3,0,SOUTH',
      ],
      [
        `MOVE
          MOVE
          pLAce 3,0,soUTH
          LefT
          move
          move
          move
          move
          move
          MoVe
          REPORT`,
        '4,0,EAST',
      ],
      [
        `MOVE
          MOVE
          pLAce 3,0,soUTH
          LefT
          left
          LeFt
          move
          move
          move
          move
          move
          move
          move
          REPORT`,
        '0,0,WEST',
      ],
      [
        `MOVE
          MOVE
          pLAce 3,0,soUTH
          LefT
          LEFt
          move
          move
          move
          move
          move
          REPORT`,
        '3,4,NORTH',
      ],
      [
        `MOVE
          MOVE
          pLAce 3,0,soUTH
          PLACE 5,10,NORTH
          REPORT`,
        '3,0,SOUTH',
      ],
    ])('%s should call %s', (input, report) => {
      const { getByPlaceholderText, getByText } = render(<TableTop />);

      jest.useFakeTimers();
      act(() => {
        userEvent.paste(getByPlaceholderText('Commands go here'), input);
        fireEvent.click(getByText('Execute'));
      });

      jest.runAllTimers();
      expect(getByText(report)).toBeInTheDocument();
    });
  });
});
