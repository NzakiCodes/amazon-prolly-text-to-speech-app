const request = require("supertest");
const { app } = require('../app');

describe("Test the Requests", () => {
    test("It should response the GET method at the root level", async () => {
        const response = await request(app)
            .get("/");
        expect(response.statusCode).toBe(200);
    });
    test("It should response the GET for /voices", async () => {
        const response = await request(app)
            .get("/voices");
        expect(response.statusCode).toBe(200);
    });
    test("It should response the POST for /listen", async () => {
        const response = await request(app)
            .get("/listen");
        expect(response.statusCode).toBe(200);
    });
});