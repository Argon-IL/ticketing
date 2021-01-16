import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from '@argonticketing/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
