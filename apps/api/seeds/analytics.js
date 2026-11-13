export async function seedAnalytics(db, idMap) {
   const { techcorp, startuphub, fintech } = idMap;

   // Derived from actual seeded data:
   // TechCorp: 4 jobs, 3 applications (napat→frontend, tanita→uiux, suda→data), 0 accepted
   // StartupHub: 4 jobs, 4 applications (priya→marketing, priya→bizdev, tanita→product, suda→content), 1 accepted (priya)
   // FinTech: 4 jobs, 3 applications (napat→backend, jirat→finance, jirat→risk), 1 accepted (jirat)
   await db.collection('analytics').insertMany([
      { employer: techcorp,   totalJobPosted: 4, totalApplicationReceived: 3, totalHire: 0, createdAt: new Date(), updatedAt: new Date() },
      { employer: startuphub, totalJobPosted: 4, totalApplicationReceived: 4, totalHire: 1, createdAt: new Date(), updatedAt: new Date() },
      { employer: fintech,    totalJobPosted: 4, totalApplicationReceived: 3, totalHire: 1, createdAt: new Date(), updatedAt: new Date() },
   ]);

   console.log('✓ analytics: 3 inserted');
}
