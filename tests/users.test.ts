import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import request from "supertest";
import app from "../src/app";
import { faker } from "@faker-js/faker";

let server: any;
let createdUserId: number;

beforeAll(() => {
  server = app.listen(3001);
});

afterAll(() => {
  server.close();
});

describe("User API", () => {
  it("should create a new user", async () => {
    // const randomName = faker.person.fullName();
    // const randomEmail = faker.internet.email();

    const response = await request(app).post("/users").send({
      name: "John Doe",
      email: "johndoe@example.com",
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("id");

    createdUserId = response.body.data.id;
  });

  it("should not create a user with an existing email", async () => {
    const response = await request(app).post("/users").send({
      name: "John Doe",
      email: "johndoe@example.com",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Email already exists");
  });

  it("should get all users", async () => {
    const response = await request(app).get("/users");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("should fetch a user by ID", async () => {
    const response = await request(app).get(`/users/${createdUserId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).toHaveProperty("name");
  });

  it("should return 404 for a non-existing user", async () => {
    const response = await request(app).get("/users/9999");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("User not found");
  });

  it("should validate user ID as a number", async () => {
    const response = await request(app).get("/users/abc");

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Invalid user ID");
  });

  it("should delete a user", async () => {
    const response = await request(app).delete(`/users/${createdUserId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
