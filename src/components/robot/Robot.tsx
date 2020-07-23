import React, { FC, useContext } from 'react';

import { ReactComponent as RobotLogo } from './robot.svg';
import styles from './Robot.module.scss';
import TableTopContext from '../TableTopContext';
import { isNull } from 'util';

const Robot: FC = () => {
  const { rotation, position } = useContext(TableTopContext);

  if (isNull(rotation) || !position) {
    return null;
  }

  return (
    <div
      className={styles.wrapper}
      style={{
        transform: `translate(${position.x * 100}px, ${
          (4 - position.y) * 100
        }px) rotate(${rotation}deg)`,
      }}
    >
      <RobotLogo className={styles.robot} role="img" aria-label="Toy robot" />
    </div>
  );
};

export default Robot;
