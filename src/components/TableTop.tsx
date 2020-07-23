import React, { useCallback, useState, useMemo } from 'react';
import classnames from 'classnames';
import { isNull } from 'util';

import Direction from '../models/Direction';
import Nullable from '../models/Nullable';

import Board from './Board';
import Robot from './robot/Robot';
import CommandInput from './CommandInput';
import styles from './TableTop.module.scss';
import { placementRegex } from './constants';
import TableTopContext, { TableTopContextValue } from './TableTopContext';

const directionRotationMap: Record<Direction, number> = {
  NORTH: 180,
  EAST: 270,
  WEST: 90,
  SOUTH: 0,
};

const TableTop = () => {
  const [position, setPosition] = useState<TableTopContextValue['position']>(
    null
  );
  const [reportedValue, setReportedValue] = useState('');
  const [reportVisible, setReportVisible] = useState(false);
  const [rotation, setRotation] = useState(0);
  // Using numeric values here to allow consecutive shakes
  const [restrictedCount, setRestrictedCount] = useState(0);

  const placeRobot = useCallback((command: string) => {
    const directionMatch = command.match(/(NORTH)|(EAST)|(WEST)|(SOUTH)$/);
    const positionMatch = command.match(/[0-4],[0-4]/);

    let coordinate: TableTopContextValue['position'] = null;
    if (directionMatch && positionMatch) {
      const [x, y] = positionMatch[0].split(',');
      coordinate = { x: parseInt(x), y: parseInt(y) };

      setRotation(directionRotationMap[directionMatch[0] as Direction]);
      setPosition(coordinate);
    }
  }, []);

  const direction = useMemo<Nullable<Direction>>(() => {
    const radians = (rotation * Math.PI) / 180;
    const calculatedX = Math.round(Math.cos(radians));
    const calculatedY = Math.round(Math.sin(radians));

    switch (true) {
      case calculatedX === 1 && calculatedY === 0:
        return 'SOUTH';
      case calculatedX === 0 && calculatedY === -1:
        return 'EAST';
      case calculatedX === -1 && calculatedY === 0:
        return 'NORTH';
      case calculatedX === 0 && calculatedY === 1:
        return 'WEST';
      default:
        return null;
    }
  }, [rotation]);

  const moveRobot = useCallback(() => {
    if (!position || isNull(rotation) || isNull(direction)) {
      return;
    }

    const { x, y } = position;

    switch (true) {
      case direction === 'NORTH' && y < 4:
        setPosition({ x, y: y + 1 });
        break;
      case direction === 'EAST' && x < 4:
        setPosition({ x: x + 1, y });
        break;
      case direction === 'WEST' && x > 0:
        setPosition({ x: x - 1, y });
        break;
      case direction === 'SOUTH' && y > 0:
        setPosition({ x, y: y - 1 });
        break;
      default:
        setRestrictedCount(val => val + 1);
    }
  }, [direction, position, rotation]);

  const runCommand = useCallback(
    (command: string) => {
      let reported = false;

      switch (true) {
        case placementRegex.test(command):
          placeRobot(command);
          break;
        case /^MOVE$/.test(command):
          moveRobot();
          break;
        case /^LEFT$/.test(command):
          setRotation(val => val - 90);
          break;
        case /^RIGHT$/.test(command):
          setRotation(val => val + 90);
          break;
        case /^REPORT$/.test(command):
          if (position && !isNull(rotation)) {
            setReportedValue(`${position.x},${position.y},${direction}`);
            setReportVisible(true);
            reported = true;
          }
          break;
        default:
      }

      if (!reported) {
        setReportVisible(false);
      }
    },
    [direction, moveRobot, placeRobot, position, rotation]
  );

  return (
    <TableTopContext.Provider
      value={{ rotation, position, runCommand, restrictedCount }}
    >
      <div className={styles['layout-wrapper']}>
        <div className={styles['board-wrapper']}>
          <div className={styles.centerer}>
            <Board />
            <Robot />

            {!isNull(rotation) && position && (
              <div
                className={classnames(styles.report, {
                  [styles.show]: reportVisible && reportedValue,
                })}
              >
                {reportedValue}
              </div>
            )}
          </div>
        </div>

        <div className={styles.commands}>
          <CommandInput />
        </div>
      </div>
    </TableTopContext.Provider>
  );
};

export default TableTop;
