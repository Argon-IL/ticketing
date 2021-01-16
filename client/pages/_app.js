import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (context) => {
  const { data } = await buildClient(context.ctx, 'auth-srv', 3000).get(
    '/api/users/currentuser'
  );
  let pageProps = {};
  if (context.Component.getInitialProps) {
    pageProps = await context.Component.getInitialProps(
      context.ctx,
      buildClient,
      data.currentUser
    );
  }
  return {
    pageProps,
    currentUser: data.currentUser,
    context: context.Component.getInitialProps,
  };
};

export default AppComponent;
