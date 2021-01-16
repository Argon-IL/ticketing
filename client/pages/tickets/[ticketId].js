import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => {
      Router.push('/orders/[orderId]', `/orders/${order.id}`);
    },
  });

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      <button onClick={(e) => doRequest()} className="btn btn-primary">
        Purchase
      </button>
      {errors}
    </div>
  );
};

TicketShow.getInitialProps = async (context, buildClient) => {
  const { ticketId } = context.query;

  const { data } = await buildClient(context, 'tickets-srv', 3000).get(
    `/api/tickets/${ticketId}`
  );

  return { ticket: data };
};

export default TicketShow;
