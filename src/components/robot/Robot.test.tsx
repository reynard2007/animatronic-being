import React from 'react';
import { render } from '@testing-library/react';
import TableTopContext from '../TableTopContext';
import Robot from './Robot';

describe('Robot', () => {
  test('should render properly', () => {
    const { container, getByLabelText } = render(
      <TableTopContext.Provider
        value={{
          runCommand: jest.fn(),
          position: { x: 0, y: 3 },
          rotation: -90,
        }}
      >
        <Robot />
      </TableTopContext.Provider>
    );

    expect(getByLabelText('Toy robot')).toBeInTheDocument();

    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="wrapper"
          style="transform: translate(0px, 100px) rotate(-90deg);"
        >
          <svg
            aria-label="Toy robot"
            class="robot"
            role="img"
          >
            robot.svg
          </svg>
        </div>
      </div>
    `);
  });

  test('should render nothing if position is null', () => {
    const { container } = render(
      <TableTopContext.Provider
        value={{
          runCommand: jest.fn(),
          position: null,
          rotation: -90,
        }}
      >
        <Robot />
      </TableTopContext.Provider>
    );

    expect(container).toBeEmptyDOMElement();
  });

  test('should render nothing if rotation is null', () => {
    const { container } = render(
      <TableTopContext.Provider
        value={{
          runCommand: jest.fn(),
          position: { x: 0, y: 3 },
          rotation: null,
        }}
      >
        <Robot />
      </TableTopContext.Provider>
    );

    expect(container).toBeEmptyDOMElement();
  });

  test('should render nothing if both rotation and position are null', () => {
    const { container } = render(
      <TableTopContext.Provider
        value={{
          runCommand: jest.fn(),
          position: null,
          rotation: null,
        }}
      >
        <Robot />
      </TableTopContext.Provider>
    );

    expect(container).toBeEmptyDOMElement();
  });
});
