import {
    ApolloClient,
    ApolloLink,
    concat,
    gql,
    HttpLink,
    InMemoryCache,
} from "@apollo/client";
import { getAccessToken } from "../auth";

/* const client = new GraphQLClient("http://localhost:9000/graphql", {
    headers: () => {
        const accessToken = getAccessToken();
        const header = accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : {};
        return header;
    },
}); */

const httpLink = new HttpLink({ uri: "http://localhost:9000/graphql" });

const authLink = new ApolloLink((operation, forward) => {
    const accessToken = getAccessToken();

    if (accessToken) {
        operation.setContext({
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    }

    return forward(operation);
});

export const apolloClient = new ApolloClient({
    link: concat(authLink, httpLink),
    cache: new InMemoryCache(),
});

const jobDetailFragment = gql`
    fragment JobDetail on Job {
        id
        date
        title
        company {
            id
            name
        }
        description
    }
`;

export const jobByIdQuery = gql`
    query JobById($id: ID!) {
        job(id: $id) {
            ...JobDetail
        }
    }
    ${jobDetailFragment}
`;

export const companyByIdQuery = gql`
    query CompanyById($id: ID!) {
        company(id: $id) {
            id
            name
            description
            jobs {
                id
                date
                title
            }
        }
    }
`;

export const jobsQuery = gql`
    query Jobs($limit: Int, $offset: Int) {
        jobs(limit: $limit, offset: $offset) {
            items {
                id
                date
                title
                company {
                    id
                    name
                }
            }
            totalRecords
        }
    }
`;

export const createJobMutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
        job: createJob(input: $input) {
            ...JobDetail
        }
    }
    ${jobDetailFragment}
`;

export async function createJob(title, description) {
    const mutation = gql`
        mutation CreateJob($input: CreateJobInput!) {
            job: createJob(input: $input) {
                ...JobDetail
            }
        }
        ${jobDetailFragment}
    `;

    /* const { job } = await client.request(mutation, {
        input: { title, description },
    });
    return job; */

    const { data } = await apolloClient.mutate({
        mutation,
        variables: { input: { title, description } },
        update: (cache, { data }) => {
            cache.writeQuery({
                query: jobByIdQuery,
                variables: { id: data.job.id },
                data,
            });
        },
    });
    return data.job;
}

/* export async function getCompany(id) {
    const query = gql`
        query CompanyById($id: ID!) {
            company(id: $id) {
                id
                name
                description
                jobs {
                    id
                    date
                    title
                }
            }
        }
    `;

    //const { company } = await client.request(query, { id });
    //return company;

    const { data } = await apolloClient.query({ query, variables: { id } });
    return data.company;
} */

/* export async function getJob(id) {
    //const { job } = await client.request(query, { id });
    //return job;

    const { data } = await apolloClient.query({
        query: jobByIdQuery,
        variables: { id },
    });
    return data.job;
} */

/* export async function getJobs(limit, offset) {
    const query = gql`
        query Jobs($limit: Int, $offset: Int) {
            jobs(limit: $limit, offset: $offset) {
                items {
                    id
                    date
                    title
                    company {
                        id
                        name
                    }
                }
                totalRecords
            }
        }
    `;

    //const { jobs } = await client.request(query);
    //return jobs;

    const { data } = await apolloClient.query({
        query,
        fetchPolicy: "network-only",
        variables: { limit, offset },
    });
    return data.jobs;
} */
