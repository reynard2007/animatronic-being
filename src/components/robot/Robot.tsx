import React, { FC, useContext, useState, useEffect, useCallback } from 'react';
import classnames from 'classnames';
import { isNull } from 'util';

import TableTopContext from '../TableTopContext';

import { ReactComponent as RobotLogo } from './robot.svg';
import styles from './Robot.module.scss';

const Robot: FC = () => {
  const { rotation, position, restrictedCount } = useContext(TableTopContext);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (restrictedCount) {
      setShake(true);
    }
  }, [restrictedCount]);

  const handleAnimationEnd = useCallback(() => {
    setShake(false);
  }, []);

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
      <RobotLogo
        className={classnames(styles.robot, {
          [styles['head-shake']]: shake,
        })}
        onAnimationEnd={handleAnimationEnd}
        role="img"
        aria-label="Toy robot"
      />
    </div>
  );
};

export default Robot;
