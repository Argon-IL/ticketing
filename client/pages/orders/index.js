const OrderIndex = ({ orders }) => {
  return (
    <ul className="list-group">
      {orders.map((order) => {
        return (
          <li className="list-group-item m-1" key={order.id}>
            {order.ticket.title} - {order.status}
          </li>
        );
      })}
    </ul>
  );
};

OrderIndex.getInitialProps = async (context, buildClient) => {
  const { data } = await buildClient(context, 'orders-srv', 3000).get(
    '/api/orders'
  );

  return { orders: data };
};

export default OrderIndex;
