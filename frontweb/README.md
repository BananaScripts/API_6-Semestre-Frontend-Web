# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## AKASYS design CSS

This project includes the AKASYS design system CSS at `src/styles/akasys.css`. It defines tokens, light/dark themes, components (cards, buttons, inputs, tab bar) and utility spacing.

To toggle dark/light theme from JavaScript set the dataset value on the root element:

```javascript
document.documentElement.dataset.theme = 'dark';
// or
document.documentElement.dataset.theme = 'light';
```

## Frontend-only auth (DEV only)

For quick local development you can enable a frontend-only authentication mode that does not contact the backend and stores user data in localStorage.

- Enabled by default in `.env.development` with `REACT_APP_FRONTEND_AUTH=true`.
- This mode is INSECURE and should only be used for local development or prototyping. It stores user records under `fw_users` in localStorage and issues fake tokens like `fw-token:email@example.com`.

To disable frontend auth (and use the backend): set `REACT_APP_FRONTEND_AUTH=false` and restart the dev server.

## Troubleshooting CORS when logging in

If you see a browser error like:

```
Requisição cross-origin bloqueada: A diretiva Same Origin (mesma origem) não permite a leitura do recurso remoto em http://localhost:8000/login (motivo: falta cabeçalho 'Access-Control-Allow-Origin' no CORS). Código de status: 404.
```

Possible causes and fixes:

- Development workaround: a proxy is configured in `package.json` to forward API requests to `http://localhost:8000` so the browser doesn't block calls during development. This only works when the React dev server is running (`npm start`).

- Permanent/server-side fix: enable CORS on the backend so responses include an `Access-Control-Allow-Origin` header. For example:

	- Express (Node.js):
		```js
		const cors = require('cors');
		app.use(cors()); // allow all origins for dev
		```

	- Flask (Python):
		```py
		from flask_cors import CORS
		CORS(app)
		```

	- For production, set `Access-Control-Allow-Origin` to a specific origin (e.g. `https://your-domain.com`) instead of `*`.

- The specific 404 means the backend returned Not Found for `/login`. Verify the backend is running on port 8000 and that `/login` route exists and accepts the HTTP method you're calling (POST vs GET).

#### Configurando a rota de login no frontend

Você pode apontar o frontend para diferentes rotas de backend sem alterar o código fonte, usando variáveis de ambiente no arquivo `frontweb/.env.development` (lido por `npm start`).

- `REACT_APP_LOGIN_ROUTE` — caminho relativo que o frontend chamará (padrão: `/login`). Use caminhos relativos para que o proxy do dev server funcione.
- `REACT_APP_USE_FORM` — `true` para enviar `application/x-www-form-urlencoded`, `false` para enviar JSON (padrão: `false`).

Exemplo incluído em `.env.development`:

```
REACT_APP_LOGIN_ROUTE=/usuario
REACT_APP_USE_FORM=false
```

Consulte `reminders/ROUTES.md` para as rotas documentadas no backend (por exemplo `POST /usuario` para criar usuário).


### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
