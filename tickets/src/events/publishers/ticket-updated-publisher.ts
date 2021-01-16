import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@argonticketing/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
