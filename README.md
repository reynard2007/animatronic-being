This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Running the Project

1. Open a terminal window and go to the root directory of this project
2. Ensure that `yarn` is installed - I'm using v1.22.4 -
3. For best results, run the project in the Node version indicated in the `.nvmrc` file. If you have `nvm` installed on a Unix-based machine, you can run `nvm use` - the Node version may need to be installed if it's not yet
4. Enter `yarn start` on the command line
5. Open the browser in [http://localhost:3000](http://localhost:3000)

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

## Valid Commands

Each line of the command textarea must be one of the following patterns

- `PLACE 0,0,<DIRECTION>`
- `MOVE`
- `LEFT`
- `RIGHT`
- `REPORT`

## Sample Instructions

These are sample instructions that you can use:

```
place 0,0,south
report
place 4,0,south
report
place 4,4,south
report
place 0,4,south
report

```

```
place 0,0,south
right
right
right
move
move
report
report
report
left
left
move
move
left
report

```

```
place 0,4,south
move
left
move
left
move
left
move
left
report

```

```
left
right
move
place 0,4,south
move
left
move
right
move
left
move
right
move
left
move
right
move
left
move
right
report
```
