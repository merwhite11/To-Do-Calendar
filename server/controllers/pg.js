const { Pool, Client } = require('pg');
const query = require('.././models/main_functions/queries.js');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

// user: postgres
// host: '54.209.199.189',
// port: '5432',
// database: 'tododb',
const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASS,
  database: process.env.PGDB,
  port: process.env.PGPORT,
  host: process.env.PGHOST
});

console.log('should be host', process.env.PGHOST)
const getInfo = async (email, callback) => {
  (async () => {
    const client = await pool.connect()
    try {
      const result = await client.query(query.getInfo, [email]);
      callback(null, result);
    } finally {
      client.release();
    }
  })().catch((err) => {
    console.log(err.stack)
  })
};

const getSharedWithUser = async function (email) {
  const client = await pool.connect()
  try {
    return await client.query(query.getSharedWithUser, [email]);
  } catch (err) {
    throw (err);
  } finally {
    client.release();
  }
};

const getSharedByUser = async function (email) {
  const client = await pool.connect()
  try {
    return await client.query(query.getSharedByUser, [email]);
  } catch (err) {
    throw (err);
  } finally {
    client.release();
  }
};

const insertToShares = async function (userEmail, emailToAdd) {
  const client = await pool.connect();
  var values = [...userEmail];
  console.log('attempting to add these values: ', values);
  console.log('with this query: ', query.insertToShares);
  try {
    return await client.query(query.insertToShares, [values[0], values[1]]);
  } catch (err) {
    throw (err);
  } finally {
    client.release();
  }
};

const deleteFromShares = async function (userEmail, emailToDelete) {
  const client = await pool.connect()
  try {
    return await client.query(query.deleteFromShares, userEmail, emailToDelete);
  } catch (err) {
    throw (err);
  } finally {
    client.release();
  }
};


const getSharedTo = async (email) => {
  (async () => {
    const client = await pool.connect()
    try {
      const result = await client.query(query.getSharedTo, [email]);
      return result;
    } finally {
      client.release();
    }
  })().catch((err) => {
    console.log(err.stack);
  })
};

const postCategory = (calendarId, category, callback) => {
  (async () => {
    const client = await pool.connect()
    try {
      const result = await client.query(query.postCategory, [calendarId, category]);
      let category_id = result.rows[0].category_id;
      callback(null, category_id);
    } finally {
      client.release();
    }
  })().catch((err) => {
    console.log(err.stack)
  })
};

const postItem = (title, description, duration, start, end_date, in_calendar, category_id, callback) => {
  (async () => {
    const client = await pool.connect()
    try {
      const result = await client.query(query.postItem, [title, description, duration, start, end_date, in_calendar, category_id]);
      let taskId = result.rows[0].id;
      callback(null, taskId);
    } finally {
      client.release();
    }
  })().catch((err) => {
    console.log(err.stack)
  })
};

const updateCategory = (categoryId, category, callback) => {
  (async () => {
    const client = await pool.connect()
    try {
      const result = await client.query(query.updateCategory, [categoryId, category]);
      callback(null, result);
    } finally {
      client.release();
    }
  })().catch((err) => {
    console.log(err.stack)
  })
};

const updateItem = (title, description, duration, start, end_date, in_calendar, itemId, callback) => {
  (async () => {
    const client = await pool.connect()
    try {
      const result = await client.query(query.updateItem, [title, description, duration, start, end_date, in_calendar, itemId]);
      callback(null, result);
    } finally {
      client.release();
    }
  })().catch((err) => {
    console.log(err.stack)
  })
};

const deleteItem = (itemId, callback) => {
  (async () => {
    const client = await pool.connect()
    try {
      const result = await client.query(query.deleteItem, [itemId]);
      callback(null, result);
    } finally {
      client.release();
    }
  })().catch((err) => {
    console.log(err.stack)
  })
};

const deleteCategory = (categoryId, callback) => {
  (async () => {
    const client = await pool.connect()
    try {
      await client.query(query.alterItem);
      const result = await client.query(query.deleteCategory, [categoryId]);
      callback(null, result);
    } finally {
      client.release();
    }
  })().catch((err) => {
    console.log(err.stack)
  })
};

module.exports = {
  getInfo,
  postCategory,
  postItem,
  updateCategory,
  updateItem,
  deleteItem,
  deleteCategory,
  getSharedWithUser,
  getSharedByUser,
  insertToShares,
  deleteFromShares
}