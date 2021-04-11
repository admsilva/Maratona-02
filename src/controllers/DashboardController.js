const Job = require("../model/Job");
const JobUtils = require("../utils/JobUtils");
const Profile = require("../model/Profile");

module.exports = {
  async index(request, response) {
    const jobs = await Job.get();
    const profile = await Profile.get();

    let statusCount = {
      progress: 0,
      done: 0,
      total: jobs.length
    }

    // total de hora por dia de cada Job em progresso
    let jobTotalHours = 0;

    const updatedJobs = jobs.map((job) => {
      // ajustes no jobs
      const remaining = JobUtils.remainingDays(job);
      const status = remaining <= 0 ? "done" : "progress";

      // Somando a quantidade por status
      statusCount[status] += 1;

      // somando hora por dia de cada Job em progresso
      jobTotalHours = (String(status) === 'progress') ? 
        jobTotalHours + Number(job["daily-hours"]) :
        jobTotalHours;
      
      /* Forma não refatorada
      if (status === 'progress') {
        jobTotalHours += Number(job["daily-hours"]);
      }
      */
     
      const budget = JobUtils.calculateBudget(job, profile["value-hour"]);

      return {
        ...job,
        remaining,
        status,
        budget,
      };
    });

    // qtd de horas que quero trabalhar dia (PROFILE) 
    // menos 
    // quatidade de horas/dia de cada job em progress
    const freeHours = profile["hours-per-day"] - jobTotalHours;

    return response.render("index", { jobs: updatedJobs, profile, status: statusCount, freeHours: freeHours});
  },
};
