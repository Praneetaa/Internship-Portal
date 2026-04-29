import 'dotenv/config';
import mongoose from 'mongoose';
import { seedUsers }              from './seeds/users.js';
import { seedJobs }               from './seeds/jobs.js';
import { seedEvents }             from './seeds/events.js';
import { seedApplications }       from './seeds/applications.js';
import { seedSavedJobs }          from './seeds/savedJobs.js';
import { seedEventRegistrations } from './seeds/eventRegistrations.js';
import { seedAnalytics }          from './seeds/analytics.js';

const COLLECTIONS = [
   'users', 'jobs', 'events', 'applications',
   'savedjobs', 'eventregistrations', 'analytics',
];

async function run() {
   await mongoose.connect(process.env.MONGO_URI);
   const db = mongoose.connection.db;

   console.log('Dropping collections...');
   for (const col of COLLECTIONS) {
      await db.collection(col).drop().catch(() => {});
   }

   const idMap = {};

   Object.assign(idMap, await seedUsers(db));
   Object.assign(idMap, await seedJobs(db, idMap));
   Object.assign(idMap, await seedEvents(db, idMap));
   await seedApplications(db, idMap);
   await seedSavedJobs(db, idMap);
   await seedEventRegistrations(db, idMap);
   await seedAnalytics(db, idMap);

   await mongoose.disconnect();
   console.log('\nDone! DB seeded for MVP demo.');
}

run().catch((err) => {
   console.error(err);
   process.exit(1);
});
