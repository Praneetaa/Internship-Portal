import mongoose from 'mongoose';

const days = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);
const id   = () => new mongoose.Types.ObjectId();

export async function seedEvents(db, idMap) {
   const { techcorp, startuphub, fintech } = idMap;

   const careerFair = id();
   const workshop   = id();
   const webinar    = id();
   const networking = id();
   const seminar    = id();

   await db.collection('events').insertMany([
      {
         _id: careerFair,
         title: 'Tech Career Fair 2026',
         description: 'Meet recruiters from 15+ leading tech companies in Bangkok. Bring printed resumes and dress professionally. Open to all university students and recent graduates.',
         eventType: 'Career Fair',
         mode: 'In-Person',
         location: 'Siam University Main Hall, Bangkok',
         link: '',
         date: days(14),
         endDate: days(14),
         deadline: days(10),
         coverImage: '',
         seats: 200,
         tags: 'tech, internship, career, Bangkok',
         organizer: techcorp,
         isClosed: false,
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      {
         _id: workshop,
         title: 'React & Node.js Bootcamp',
         description: 'A hands-on full-day workshop covering React 19 hooks, React Router, and building a REST API with Express. Laptops required.',
         eventType: 'Workshop',
         mode: 'Online',
         location: '',
         link: 'https://zoom.us/j/demo',
         date: days(7),
         endDate: days(7),
         deadline: days(5),
         coverImage: '',
         seats: 50,
         tags: 'react, nodejs, web development',
         organizer: startuphub,
         isClosed: false,
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      {
         _id: webinar,
         title: 'Future of Fintech in ASEAN',
         description: 'Industry leaders from FinTech Solutions, Kasikorn Bank, and Grab Financial share insights on embedded finance, CBDCs, and open banking regulation.',
         eventType: 'Webinar',
         mode: 'Online',
         location: '',
         link: 'https://zoom.us/j/demo2',
         date: days(21),
         endDate: days(21),
         deadline: days(18),
         coverImage: '',
         seats: 300,
         tags: 'fintech, ASEAN, banking, regulation',
         organizer: fintech,
         isClosed: false,
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      {
         _id: networking,
         title: 'Tech Alumni Networking Night',
         description: 'Connect with working professionals and recent graduates over dinner. Structured speed-networking rounds followed by an open mingle session.',
         eventType: 'Networking',
         mode: 'Hybrid',
         location: 'True Digital Park, Bangkok',
         link: 'https://meet.google.com/demo',
         date: days(30),
         endDate: days(30),
         deadline: days(27),
         coverImage: '',
         seats: 80,
         tags: 'networking, alumni, career',
         organizer: techcorp,
         isClosed: false,
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      {
         _id: seminar,
         title: 'Applied Data Science Seminar',
         description: 'A past seminar covering machine learning pipelines, feature engineering, and model deployment on AWS SageMaker.',
         eventType: 'Seminar',
         mode: 'In-Person',
         location: 'NECTEC, Pathumthani',
         link: '',
         date: days(-7),
         endDate: days(-7),
         deadline: days(-10),
         coverImage: '',
         seats: 60,
         tags: 'data science, machine learning, AWS',
         organizer: fintech,
         isClosed: true,
         createdAt: new Date(),
         updatedAt: new Date(),
      },
   ]);

   console.log('✓ events: 5 inserted');
   return { careerFair, workshop, webinar, networking, seminar };
}
