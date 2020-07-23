import React, { ChangeEventHandler, Component } from 'react';

import { placementRegex, commandRegex } from './constants';
import styles from './CommandInput.module.scss';
import TableTopContext from './TableTopContext';

const parseInput = (c: string) => {
  const lines = c.split('\n');
  let placed = false;

  const results: Array<string> = [];
  lines.forEach(line => {
    const trimmed = line.trim();

    if (!placed && placementRegex.test(trimmed)) {
      placed = true;
      results.push(trimmed.toUpperCase());
    } else if (placed && commandRegex.test(trimmed)) {
      results.push(trimmed.toUpperCase());
    }
  });

  return results;
};

type State = {
  commands: string;
  currIndex: number;
  validatedCommands: Array<string>;
};

class CommandInput extends Component<{}, State> {
  static contextType = TableTopContext;

  state: State = {
    commands: '',
    currIndex: -1,
    validatedCommands: [],
  };

  componentDidUpdate(_: {}, prevState: State) {
    const { currIndex, validatedCommands } = this.state;

    if (
      currIndex > -1 &&
      currIndex !== prevState.currIndex &&
      validatedCommands[currIndex]
    ) {
      this.context.runCommand(validatedCommands[currIndex]);

      setTimeout(() => {
        /**
         * This is normally avoided, but no other option is apparent
         * as of writing in order to achieve chaining of run commands
         */
        this.setState(({ currIndex, ...state }) => ({
          ...state,
          currIndex: currIndex + 1,
        }));
      }, 750);
    } else if (currIndex >= validatedCommands.length) {
      this.resetCommands();
    }
  }

  handleChange: ChangeEventHandler<HTMLTextAreaElement> = ev => {
    this.setState({ commands: ev.target.value });
  };

  triggerExecution = async () => {
    this.setState(state => ({
      ...state,
      validatedCommands: parseInput(state.commands),
      currIndex: 0,
    }));
  };

  resetCommands = () => {
    this.setState(state => ({
      ...state,
      validatedCommands: [],
      currIndex: -1,
    }));
  };

  render() {
    const { currIndex } = this.state;

    return (
      <div className={styles.flex}>
        <textarea
          className={styles.commands}
          name="bot-commands"
          id="bot-commands"
          onChange={this.handleChange}
          rows={10}
        />

        <button
          className={styles.button}
          onClick={this.triggerExecution}
          disabled={currIndex > -1}
        >
          Execute
        </button>
      </div>
    );
  }
}

export default CommandInput;
