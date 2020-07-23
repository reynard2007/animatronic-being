import React, { useMemo } from 'react';

import styles from './Board.module.scss';

const Board = () => {
  const boardKeys = useMemo(
    () => Array.from({ length: 25 }).map((_, i) => i + 1),
    []
  );

  return (
    <div className={styles.board} role="img">
      {boardKeys.map(id => (
        <div className={styles.square} key={id} data-testid="square" />
      ))}
    </div>
  );
};

export default Board;
