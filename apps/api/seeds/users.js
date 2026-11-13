import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

export async function seedUsers(db) {
   const password = await bcrypt.hash('Demo1234!', 10);
   const id = () => new mongoose.Types.ObjectId();

   const techcorp   = id();
   const startuphub = id();
   const fintech    = id();
   const napat      = id();
   const priya      = id();
   const tanita     = id();
   const jirat      = id();
   const suda       = id();

   await db.collection('users').insertMany([
      {
         _id: techcorp,
         name: 'Arisa Techworks',
         email: 'arisa@techcorp.th',
         password,
         role: 'organization',
         companyName: 'TechCorp Bangkok',
         companyDescription: 'Leading SaaS company building productivity tools for Southeast Asian enterprises.',
         companyLogo: '',
         avatar: '',
         resume: '',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      {
         _id: startuphub,
         name: 'Manon Startup',
         email: 'manon@startuphub.th',
         password,
         role: 'organization',
         companyName: 'StartupHub Thailand',
         companyDescription: 'Early-stage startup accelerator and digital marketing agency based in Chiang Mai.',
         companyLogo: '',
         avatar: '',
         resume: '',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      {
         _id: fintech,
         name: 'Krit Finance',
         email: 'krit@fintechsolutions.th',
         password,
         role: 'organization',
         companyName: 'FinTech Solutions',
         companyDescription: 'Regulatory-compliant fintech firm offering payment infrastructure and risk analytics across ASEAN.',
         companyLogo: '',
         avatar: '',
         resume: '',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      {
         _id: napat,
         name: 'Napat Saelim',
         email: 'napat@student.th',
         password,
         role: 'candidate',
         avatar: '',
         resume: 'https://example.com/resumes/napat.pdf',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      {
         _id: priya,
         name: 'Priya Mendez',
         email: 'priya@student.th',
         password,
         role: 'candidate',
         avatar: '',
         resume: 'https://example.com/resumes/priya.pdf',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      {
         _id: tanita,
         name: 'Tanita Wong',
         email: 'tanita@student.th',
         password,
         role: 'candidate',
         avatar: '',
         resume: 'https://example.com/resumes/tanita.pdf',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      {
         _id: jirat,
         name: 'Jirat Phuket',
         email: 'jirat@student.th',
         password,
         role: 'candidate',
         avatar: '',
         resume: 'https://example.com/resumes/jirat.pdf',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      {
         _id: suda,
         name: 'Suda Chantra',
         email: 'suda@student.th',
         password,
         role: 'candidate',
         avatar: '',
         resume: 'https://example.com/resumes/suda.pdf',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
   ]);

   console.log('✓ users: 8 inserted');
   return { techcorp, startuphub, fintech, napat, priya, tanita, jirat, suda };
}
