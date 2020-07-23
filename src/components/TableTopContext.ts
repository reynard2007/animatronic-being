import { createContext } from 'react';

import Nullable from '../models/Nullable';
import Coordinate from '../models/Coordinate';

export interface TableTopContextValue {
  position: Nullable<Coordinate>;
  rotation: Nullable<number>;
  runCommand(command: string): void;
  restrictedCount: number;
}

const initialTableTopContextValue = {
  runCommand: () => {},
  position: null,
  rotation: null,
  restrictedCount: 0,
};

const TableTopContext = createContext<TableTopContextValue>(
  initialTableTopContextValue
);

export default TableTopContext;
