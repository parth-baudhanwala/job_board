import { connection } from "../db/connection.js";

const { schema } = connection;

await schema.dropTableIfExists("user");
await schema.dropTableIfExists("job");
await schema.dropTableIfExists("company");

await schema.createTable("company", (table) => {
    table.text("id").notNullable().primary();
    table.text("name").notNullable();
    table.text("description");
});

await schema.createTable("job", (table) => {
    table.text("id").notNullable().primary();
    table.text("companyId").notNullable().references("id").inTable("company");
    table.text("title").notNullable();
    table.text("description");
    table.text("createdAt").notNullable();
});

await schema.createTable("user", (table) => {
    table.text("id").notNullable().primary();
    table.text("companyId").notNullable().references("id").inTable("company");
    table.text("email").notNullable().unique();
    table.text("password").notNullable();
});

await connection.table("company").insert([
    {
        id: "MicJCHJALA4i",
        name: "Microsoft",
        description: "Our mission is to build AI dominated world.",
    },
    {
        id: "Go7QW9LcnF5d",
        name: "Google",
        description: "Our mission is to build Human dominated world.",
    },
]);

await connection.table("job").insert([
    {
        id: "f3YzmnBZpK0o",
        companyId: "MicJCHJALA4i",
        title: "Software Engineer",
        description:
            "We are looking for a Software Engineer familiar DSA with 1 or 2 years of experience.",
        createdAt: "2024-10-08T08:00:00.000Z",
    },
    {
        id: "XYZNJMXFax6n",
        companyId: "MicJCHJALA4i",
        title: "Software Development Engineer III",
        description:
            "We are looking for a SDE III familiar with DSA, System Design and DotNet Technology.",
        createdAt: "2024-12-11T11:00:00.000Z",
    },
    {
        id: "6mA05AZxvS1R",
        companyId: "Go7QW9LcnF5d",
        title: "Full-Stack Developer",
        description:
            "We are looking for a Full-Stack Developer familiar with Node.js, Express, and React.",
        createdAt: "2024-01-05T03:00:00.000Z",
    },
]);

await connection.table("user").insert([
    {
        id: "AcMJpL7b413Z",
        companyId: "MicJCHJALA4i",
        email: "pbaudhanwala@microsoft.com",
        password: "parth123",
    },
    {
        id: "BvBNW636Z89L",
        companyId: "Go7QW9LcnF5d",
        email: "hailee@google.com",
        password: "hailee123",
    },
]);

process.exit();
