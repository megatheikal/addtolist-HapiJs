"use strict";

module.exports = [
  {
    method: "GET",
    path: "/todos",
    handler: async (request, h) => {
      const todos = await request.pgsql.query(`SELECT * FROM todo`);
      return todos.rows;
    }
  },
  {
    methods: "GET",
    path: "/todo/{todo_id}",
    handler: async (request, h) => {
      const todos = await request.pgsql.query(
        `SELECT * FROM todo WHERE todo_id = %L LIMIT 1`,
        [request.params.todo_id]
      );
      return todos.rows[0];
    }
  },
  {
    methods: "PUT",
    path: "/todo",
    handler: async (request, h) => {
      const todos = await request.pgsql.query(
        `INSERT INTO todo ("todo_title") values ($1) RETURNING *;`,
        [request.payload.todo_title]
      );
      return todos.rows[0];
    }
  },
  {
    methods: "POST",
    path: "/todo/{todo_id}",
    handler: async (request, h) => {
      const todos = await request.pgsql.query(
        `UPDATE public.todo SET "completed" = $1 WHERE todo_id = $2 RETURNING *`,
        [request.payload.completed, request.params.todo_id]
      );
      return todos.rows[0];
    }
  },
  {
    methods: "DELETE",
    path: "/todo/{todo_id}",
    handler: async (request, h) => {
      const todos = await request.pgsql.query(
        `DELETE FROM todo where todo_id $1 `,
        [request.params.todo_id]
      );
      return todos.rows[0];
    }
  }
];
