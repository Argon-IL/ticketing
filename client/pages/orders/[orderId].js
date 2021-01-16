import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      {timeLeft} seconds until order expires
      <StripeCheckout
        token={(token) => {
          doRequest({ token: token.id });
        }}
        stripeKey="pk_test_51I96U7KsE04GnvlE8QWws5e7oNH00WhyefdZTnQm0Zdg4GOTCD74MGJDGkHNLeTtaz9ov3Akh6wEYiW4PeolZHH400M13M9ioE"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, buildClient) => {
  const { orderId } = context.query;
  const { data } = await buildClient(context, 'orders-srv', 3000).get(
    `/api/orders/${orderId}`
  );

  return { order: data };
};

export default OrderShow;