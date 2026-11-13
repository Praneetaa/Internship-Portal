export async function seedSavedJobs(db, idMap) {
   const { napat, priya, tanita, jirat, suda, techcorpFrontend, techcorpDevOps, startupProduct, startupMarketing, fintechFinance, fintechBackend } = idMap;

   await db.collection('savedjobs').insertMany([
      { candidate: napat,  job: techcorpDevOps,   createdAt: new Date(), updatedAt: new Date() },
      { candidate: napat,  job: fintechFinance,   createdAt: new Date(), updatedAt: new Date() },
      { candidate: priya,  job: startupProduct,   createdAt: new Date(), updatedAt: new Date() },
      { candidate: tanita, job: techcorpFrontend, createdAt: new Date(), updatedAt: new Date() },
      { candidate: jirat,  job: fintechBackend,   createdAt: new Date(), updatedAt: new Date() },
      { candidate: suda,   job: startupMarketing, createdAt: new Date(), updatedAt: new Date() },
   ]);

   console.log('✓ savedjobs: 6 inserted');
}
