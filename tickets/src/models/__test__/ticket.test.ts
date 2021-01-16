import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  });

  await ticket.save();

  const firstInstanse = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstanse!.set({ price: 10, version: firstInstanse!.version + 1 });
  secondInstance!.set({ price: 15, version: secondInstance!.version + 1 });

  await firstInstanse!.save();

  await expect(secondInstance!.save()).rejects.toBeInstanceOf(Error);
});

// it('increments the version number on multiple saves', async () => {
//   const ticket = Ticket.build({
//     title: 'concert',
//     price: 30,
//     userId: '2321',
//   });

//   await ticket.save();
//   expect(ticket.version).toBe(0);
//   await ticket.save();
//   expect(ticket.version).toBe(1);
//   await ticket.save();
//   expect(ticket.version).toBe(2);
// });
