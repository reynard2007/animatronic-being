import { createContext } from 'react';

import Nullable from '../models/Nullable';
import Coordinate from '../models/Coordinate';

export interface TableTopContextValue {
  position: Nullable<Coordinate>;
  rotation: Nullable<number>;
  runCommand(command: string): void;
}

const initialTableTopContextValue = {
  runCommand: () => {},
  position: null,
  rotation: null,
};

const TableTopContext = createContext<TableTopContextValue>(
  initialTableTopContextValue
);

export default TableTopContext;
