export async function seedApplications(db, idMap) {
   const {
      napat, priya, tanita, jirat, suda,
      techcorpFrontend, techcorpData, techcorpUIUX,
      startupMarketing, startupContent, startupProduct, startupBizDev,
      fintechFinance, fintechRisk, fintechBackend,
   } = idMap;

   // status spread: 3 Applied, 3 In Review, 2 Accepted, 2 Rejected
   await db.collection('applications').insertMany([
      { job: techcorpFrontend,  applicant: napat,  resume: 'https://example.com/resumes/napat.pdf',  status: 'In Review', createdAt: new Date(), updatedAt: new Date() },
      { job: fintechBackend,    applicant: napat,  resume: 'https://example.com/resumes/napat.pdf',  status: 'Applied',   createdAt: new Date(), updatedAt: new Date() },
      { job: startupMarketing,  applicant: priya,  resume: 'https://example.com/resumes/priya.pdf',  status: 'Accepted',  createdAt: new Date(), updatedAt: new Date() },
      { job: startupBizDev,     applicant: priya,  resume: 'https://example.com/resumes/priya.pdf',  status: 'Rejected',  createdAt: new Date(), updatedAt: new Date() },
      { job: techcorpUIUX,      applicant: tanita, resume: 'https://example.com/resumes/tanita.pdf', status: 'In Review', createdAt: new Date(), updatedAt: new Date() },
      { job: startupProduct,    applicant: tanita, resume: 'https://example.com/resumes/tanita.pdf', status: 'Applied',   createdAt: new Date(), updatedAt: new Date() },
      { job: fintechFinance,    applicant: jirat,  resume: 'https://example.com/resumes/jirat.pdf',  status: 'Accepted',  createdAt: new Date(), updatedAt: new Date() },
      { job: fintechRisk,       applicant: jirat,  resume: 'https://example.com/resumes/jirat.pdf',  status: 'In Review', createdAt: new Date(), updatedAt: new Date() },
      { job: startupContent,    applicant: suda,   resume: 'https://example.com/resumes/suda.pdf',   status: 'Rejected',  createdAt: new Date(), updatedAt: new Date() },
      { job: techcorpData,      applicant: suda,   resume: 'https://example.com/resumes/suda.pdf',   status: 'Applied',   createdAt: new Date(), updatedAt: new Date() },
   ]);

   console.log('✓ applications: 10 inserted');
}
