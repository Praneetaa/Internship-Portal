import savedJobs from "../models/savedJobs.js";

//@desc Save a job
export const saveJob = async (req, res) => {
   try {
      const exists = await savedJobs.findOne({
         job: req.params.jobId,
         candidate: req.user._id,
      });
      if (exists) return res.status(400).json({ message: "Job already saved" });

      const saved = await savedJobs.create({
         job: req.params.jobId,
         candidate: req.user._id,
      });
      res.status(201).json(saved);
   } catch (err) {
      res.status(500).json({
         message: "Failed to save job",
         error: err.message,
      });
   }
};

//@desc Unsave a job
export const unsaveJob = async (req, res) => {
   try {
      await savedJobs.findOneAndDelete({
         job: req.params.jobId,
         candidate: req.user._id,
      });
      res.json({ message: "Job removed from saved list" });
   } catch (err) {
      res.status(500).json({
         message: "Failed to remove saved job",
         error: err.message,
      });
   }
};
//@desc Get saved jobs for current user
export const getMySavedJobs = async (req, res) => {
   try {
      const saveJob = await savedJobs
         .find({
            candidate: req.user._id,
         })
         .populate({
            path: "job",
            populate: {
               path: "company",
               select: "name companyName companyLogo",
            },
         });
      res.json(saveJob);
   } catch (err) {
      res.status(500).json({
         message: "Failed to fetch saved jobs",
         error: err.message,
      });
   }
};
