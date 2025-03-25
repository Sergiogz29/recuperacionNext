// pages/_app.js
// Punto de entrada para todas las páginas
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  // Component: la página actual
  // pageProps: los props que recibe la página actual
  return <Component {...pageProps} />;
}

export default MyApp;
