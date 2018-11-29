# Tokenfield challenge

This is a react component that provides so called tokenfield widget. It has six variations of the same widget:

1) Tokenfield with multiple values, only limited to select from list of values
2) Tokenfield with a single value, only limited to select from list of values
3) Tokenfield with multiple values, that can select from a list or allow custom values
4) Tokenfield with a single value, that can be selected from a list or typed in
5) Tokenfield with multiple values without list of suggestions
6) Tokenfield with a single value with a list of suggestions

## Features 

* Simple keyboard support (esc to close list, up/down to expand or select options with wraparound)
* Multiple/single values
* Allowing/forbidding custom values
* Suggestion list is optional
* Individually removable values
* Focus handling (tab, closing suggestions on blur, showing on focus)
* Buttons to clear values or toggle suggestion list
* Buttons are context-aware (clear button only appear when values are selected, expand button appears only when option list is available)
* Backspace can delete last chosen value










This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
