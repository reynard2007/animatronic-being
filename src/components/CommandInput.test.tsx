import React from 'react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import { render, fireEvent } from '@testing-library/react';

import TableTopContext, { TableTopContextValue } from './TableTopContext';
import CommandInput from './CommandInput';

describe('CommandInput', () => {
  let contextValue: TableTopContextValue;

  beforeEach(() => {
    contextValue = {
      runCommand: jest.fn(),
      position: null,
      rotation: null,
    };
  });

  test('should render properly', () => {
    const { getByPlaceholderText, getByText } = render(
      <TableTopContext.Provider value={contextValue}>
        <CommandInput />
      </TableTopContext.Provider>
    );

    expect(getByPlaceholderText('Commands go here')).toBeInTheDocument();
    expect(getByPlaceholderText('Commands go here')).toBeEnabled();

    expect(getByText('Execute')).toBeInTheDocument();
    expect(getByText('Execute')).toBeEnabled();
  });

  test('disable textarea and button on execute', () => {
    const { getByPlaceholderText, getByText } = render(
      <TableTopContext.Provider value={contextValue}>
        <CommandInput />
      </TableTopContext.Provider>
    );

    act(() => {
      userEvent.paste(
        getByPlaceholderText('Commands go here'),
        'PLACE 3,2,SOUTH'
      );
      fireEvent.click(getByText('Execute'));
    });

    expect(getByPlaceholderText('Commands go here')).toBeDisabled();
    expect(getByText('Execute')).toBeDisabled();
  });

  /**
   * The following tests include assertions that users are oblivious to
   * I included these to ensure that the logic behind the parsing and validation of commands run properly
   */
  describe('Runs valid commands', () => {
    test.each([
      ['PLACE 3,2,SOUTH', 'PLACE 3,2,SOUTH'],
      ['pLAce 3,0,soUTH', 'PLACE 3,0,SOUTH'],
    ])('%s --> %s', (input, expected) => {
      const { getByPlaceholderText, getByText } = render(
        <TableTopContext.Provider value={contextValue}>
          <CommandInput />
        </TableTopContext.Provider>
      );

      act(() => {
        userEvent.paste(getByPlaceholderText('Commands go here'), input);
        fireEvent.click(getByText('Execute'));
      });

      expect(contextValue.runCommand).toHaveBeenCalledWith(expected);
    });
  });

  describe('Runs sequence of commands', () => {
    test.each([
      [
        `PLACE 3,2,SOUTH
          MOVE`,
        ['PLACE 3,2,SOUTH', 'MOVE'],
      ],
      [
        `MOVE
          MOVE
          pLAce 3,0,soUTH
          LefT
          REPORT`,
        ['PLACE 3,0,SOUTH', 'LEFT', 'REPORT'],
      ],
      [
        `MOVE
          MOVE
          pLAce 3,0,soUTH
          LefT
          MOve
          PLACE 5,10,NORTH
          REPORT`,
        ['PLACE 3,0,SOUTH', 'LEFT', 'MOVE', 'REPORT'],
      ],
    ])('%s should call %s', (input, calledCommands) => {
      const { getByPlaceholderText, getByText } = render(
        <TableTopContext.Provider value={contextValue}>
          <CommandInput />
        </TableTopContext.Provider>
      );

      jest.useFakeTimers();
      act(() => {
        userEvent.paste(getByPlaceholderText('Commands go here'), input);
        fireEvent.click(getByText('Execute'));
      });

      jest.runAllTimers();
      calledCommands.forEach((cmd, i) => {
        expect(contextValue.runCommand).toHaveBeenNthCalledWith(i + 1, cmd);
      });
    });
  });

  describe('Does not run invalid commands', () => {
    test.each([['MOVE'], ['LEFT'], ['RIGHT'], ['PLACE 0,5,SOUTH'], ['REPORT']])(
      '%s',
      input => {
        const { getByPlaceholderText, getByText } = render(
          <TableTopContext.Provider value={contextValue}>
            <CommandInput />
          </TableTopContext.Provider>
        );

        act(() => {
          userEvent.paste(getByPlaceholderText('Commands go here'), input);
          fireEvent.click(getByText('Execute'));
        });

        expect(contextValue.runCommand).not.toHaveBeenCalled();
      }
    );
  });
});
