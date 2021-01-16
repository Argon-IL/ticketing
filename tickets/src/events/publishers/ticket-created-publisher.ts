import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from '@argonticketing/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
