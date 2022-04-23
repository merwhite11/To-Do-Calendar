require ('dotenv').config()
const pg = require('pg');
const pgtools = require('pgtools');

const config = {
  user: 'postgres',
  password: process.env.PGPASS,
  port: 5432,
  host: '54.209.199.189'
}

pgtools.createdb(config, 'tododb', function (err, res) {
  if (err) {
    console.error(err);
    process.exit(-1);
  }
  addTables();
});

let addTables = function() {

  const db = new pg.Pool(config);

   const execute = async (query) => {
    try {
        await db.connect();
        await db.query(query);
        return true;
    } catch (error) {
        console.error(error.stack);
        return false;
    }
  };

  const queryText1 = `
    CREATE TABLE IF NOT EXISTS "users" (
      "user_id" INT GENERATED ALWAYS AS IDENTITY,
      "user_email" VARCHAR(64) NOT NULL,
      PRIMARY KEY ("user_id")
    );`;

  const queryText2 = `
    CREATE TABLE IF NOT EXISTS "categories" (
      "category_id" INT GENERATED ALWAYS AS IDENTITY,
      "name" VARCHAR(64) NOT NULL,
      PRIMARY KEY ("category_id")
    );`;

  const queryText3 = `
    CREATE TABLE IF NOT EXISTS "todoitems" (
      "id" SERIAL,
      "title" VARCHAR(64) NOT NULL,
      "description" VARCHAR(255) NOT NULL,
      "duration" INTERVAL NOT NULL,
      "start" TIMESTAMP NOT NULL,
      "end" TIMESTAMP NOT NULL,
      "in_calendar" BOOLEAN NOT NULL,
      "category_id" INTEGER NOT NULL,
      PRIMARY KEY ("id"),
      CONSTRAINT fk_category
        FOREIGN KEY("category_id")
          REFERENCES categories("category_id")
    );`;

    const queryText4 = `
    CREATE TABLE IF NOT EXISTS "user_todo_lookup" (
      "user_id" INT NOT NULL,
      "todo_id" INT NOT NULL,
      "owner" BOOLEAN NOT NULL,
      CONSTRAINT fk_user
        FOREIGN KEY("user_id")
          REFERENCES users("user_id"),
      CONSTRAINT fk_todo
        FOREIGN KEY("todo_id")
          REFERENCES todoitems("id")
    );`;

    execute(queryText1)
      .then(function(result) {
        return execute(queryText2);
      })
      .then(function(result) {
        return execute(queryText3);
      })
      .then(function(result) {
        return execute(queryText4);
      })
      .then(function(result) {
        db.end();
      })
}



