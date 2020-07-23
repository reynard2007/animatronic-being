import React, { useMemo } from 'react';

import styles from './Board.module.scss';

const Board = () => {
  const boardKeys = useMemo(
    () => Array.from({ length: 25 }).map((_, i) => i + 1),
    []
  );

  return (
    <div className={styles.board}>
      {boardKeys.map(id => (
        <div className={styles.square} key={id} />
      ))}
    </div>
  );
};

export default Board;
