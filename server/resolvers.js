import { GraphQLError } from "graphql";
import { getCompany } from "./db/companies.js";
import {
    createJob,
    deleteJob,
    getJob,
    getJobs,
    getJobsByCompany,
    getJobsCount,
    updateJob,
} from "./db/jobs.js";

export const resolvers = {
    Query: {
        company: async (_root, { id }) => {
            const company = await getCompany(id);
            if (!company) {
                throw notFoundError("No Company found with id " + id);
            }
            return company;
        },
        job: async (_root, { id }) => {
            const job = await getJob(id);
            if (!job) {
                throw notFoundError("No Job found with id " + id);
            }
            return job;
        },
        jobs: async (_root, { limit, offset }) => {
            const items = await getJobs(limit, offset);
            const totalRecords = await getJobsCount();
            return { items, totalRecords };
        },
    },

    Mutation: {
        createJob: (_root, { input: { title, description } }, { user }) => {
            if (!user) {
                throw unauthorizedError("You are unthorized to create job.");
            }
            return createJob({ companyId: user.companyId, title, description });
        },
        deleteJob: (_root, { id }) => {
            if (!user) {
                throw unauthorizedError("You are unthorized to delete job.");
            }
            return deleteJob(id, user.companyId);
        },
        updateJob: (_root, { input: { id, title, description } }) => {
            if (!user) {
                throw unauthorizedError("You are unthorized to update job.");
            }
            return updateJob({
                id,
                companyId: user.companyId,
                title,
                description,
            });
        },
    },

    Company: {
        jobs: (company) => getJobsByCompany(company.id),
    },

    Job: {
        date: (job) => parseIsoDate(job.createdAt),
        company: (job, _args, { companyLoader }) =>
            companyLoader.load(job.companyId),
    },
};

function unauthorizedError(message) {
    throw new GraphQLError(message, {
        extensions: { code: "UNAUTHORIZED" },
    });
}

function notFoundError(message) {
    throw new GraphQLError(message, {
        extensions: { code: "NOT_FOUND" },
    });
}

function parseIsoDate(value) {
    return value.slice(0, "yyyy-mm-dd".length);
}
