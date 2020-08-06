import React, { FC } from 'react';

import styles from './Pothole.module.scss';
import Coordinate from '../models/Coordinate';

type Props = {
  coord: Coordinate;
};

const Pothole: FC<Props> = ({ coord }) => {
  return (
    <div
      className={styles.pothole}
      style={{
        left: `${coord.x * 100}px`,
        top: `${(4 - coord.y) * 100}px`,
      }}
    />
  );
};

export default Pothole;
