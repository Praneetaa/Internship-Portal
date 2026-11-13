export async function seedEventRegistrations(db, idMap) {
   const { napat, priya, tanita, jirat, careerFair, workshop } = idMap;

   await db.collection('eventregistrations').insertMany([
      { event: careerFair, candidate: napat,  createdAt: new Date(), updatedAt: new Date() },
      { event: careerFair, candidate: priya,  createdAt: new Date(), updatedAt: new Date() },
      { event: workshop,   candidate: tanita, createdAt: new Date(), updatedAt: new Date() },
      { event: workshop,   candidate: jirat,  createdAt: new Date(), updatedAt: new Date() },
   ]);

   console.log('✓ eventregistrations: 4 inserted');
}
