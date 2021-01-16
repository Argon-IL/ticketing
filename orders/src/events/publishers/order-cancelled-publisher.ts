import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from '@argonticketing/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
