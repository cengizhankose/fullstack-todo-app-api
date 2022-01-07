const request = require("supertest");
const server = require("./index");

describe("GET /todos", () => {
  test("should respond with a 200 status code", async () => {
    const response = await request(server).get("/todos");
    expect(response.statusCode).toBe(200);
  });
  test("should respond with an array of todos", async () => {
    const response = await request(server).get("/todos");
    expect(response).toBeDefined();
  });
});

describe("POST /todos", () => {
  describe("given a title for todo", () => {
    test("should respond with a 200 status code", async () => {
      const response = await request(server)
        .post("/todos")
        .send({ id: 0, title: "todooo", completed: false });
      expect(response.statusCode).toBe(200);
    });
    test("should specify json in the content type header", async () => {
      const response = await request(server)
        .post("/todos")
        .send({ id: 0, title: "todooo", completed: false });
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
    test("response has a body that contains todo datas", async () => {
      const response = await request(server)
        .post("/todos")
        .send({ id: 0, title: "todooo", completed: false });
      expect(response.body.id).toBeDefined();
      expect(response.body.title).toBeDefined();
      expect(response.body.completed).toBeDefined();
    });
  });
  describe("when the title is invalid", () => {
    test("should respond with a status code of 400", async () => {
      const bodyData = [
        { title: null },
        { title: undefined },
        { title: "" },
        {},
      ];
      for (const body of bodyData) {
        const response = await request(server).post("/todos").send(body);
        expect(response.statusCode).toBe(400);
      }
    });
  });
});

describe("DELETE /todos", () => {
  describe("given a id for todo", () => {
    test("should respond with a 200 status code", async () => {
      const before = await request(server).get("/todos");
      const response = await request(server).delete(
        `/todos/${before.body[before.body.length - 1].id}`
      );
      expect(response.statusCode).toBe(200);
    });

    test("response has a body that contains todo datas", async () => {
      const before = await request(server).get("/todos");
      const response = await request(server).delete(
        `/todos/${before.body[before.body.length - 1].id}`
      );
      expect(response.body.length).toBeGreaterThanOrEqual(0);
    });

    test("deletes a todo", async () => {
      const before = await request(server).get("/todos");
      const response = await request(server).delete(
        `/todos/${before.body[before.body.length - 1].id}`
      );
      const after = await request(server).get("/todos");

      expect(before.body.length).toBeGreaterThan(after.body.length);
    });
  });
});

describe("PATCH /todos", () => {
  describe("given a id for todo", () => {
    test("should respond with a 200 status code", async () => {
      const before = await request(server).get("/todos");
      const response = await request(server).patch(
        `/todos/${before.body[before.body.length - 1].id}`
      );
      expect(response.statusCode).toBe(200);
    });

    test("response has a body that contains todo datas", async () => {
      const before = await request(server).get("/todos");
      const response = await request(server).patch(
        `/todos/${before.body[before.body.length - 1].id}`
      );
      expect(response.body).toBeDefined();
    });

    test("updates the todo", async () => {
      const before = await request(server).get("/todos");
      await request(server)
        .patch(`/todos/${before.body[before.body.length - 1].id}`)
        .send({ completed: !before.body[before.body.length - 1].completed });
      const after = await request(server).get("/todos");

      expect(before.body[before.body.length - 1].completed).toBe(
        !after.body[after.body.length - 1].completed
      );
    });
  });
});
