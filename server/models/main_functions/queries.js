module.exports = {

  getInfo:
    `select user_id, user_email,
      (
        select array_to_json(array_agg(row_to_json(d)))
        from (
          select calendars.calendar_id, calendars.user_id, calendars.calendar_owner,
          coalesce(
              (
              select array_to_json(array_agg(row_to_json(y)))
              from(
                SELECT
                categories.category_id,
                categories.category,
                coalesce(
                  (
                  select array_to_json(array_agg(row_to_json(z)))
                  from(
                    SELECT
                    todoitems.id,
                    todoitems.title,
                    todoitems.description,
                    todoitems.duration,
                    todoitems.start,
                    todoitems.end_date,
                    todoitems.in_calendar
                    FROM todoitems
                    where todoitems.category_id = categories.category_id
                  ) z
                ), '[]'
              ) as items
                FROM categories
                where categories.calendar_id = calendars.calendar_id
              ) y
            ), '[]'
          ) as categories
            from calendars
            where calendars.user_id = users.user_id
        ) d
      ) as calendars
    from users
    where user_email = $1;
  `,

  getSharedByUser: `SELECT shared_to FROM sharedCals WHERE user_email = $1;`,
  getSharedWithUser: `SELECT user_email FROM sharedCals WHERE shared_to = $1;`,
  insertToShares: `INSERT INTO sharedCals (user_email, shared_to) VALUES ($1, $2);`,
  deleteFromShares: `DELETE FROM sharedCals WHERE user_email = $1 AND shared_to = $2 RETURNING *;`,
  userExists: `SELECT user_email FROM users WHERE user_email = $1;`,

  postCategory: `
    insert into categories (
      calendar_id,
      category
   )
    VALUES ($1, $2) RETURNING category_id;
    `,
  postItem: `
    insert into todoitems (
      title,
      description,
      duration,
      start,
      end_date,
      in_calendar,
      category_id
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;
    `,
  updateCategory: `
    update categories
    set category = $2 where category_id = $1;
  `,

  updateItem: `
    update todoitems
    set
    title = $1,
    description = $2,
    duration = $3,
    start = $4,
    end_date = $5,
    in_calendar = $6
    where id = $7;
  `,

  deleteItem: `
    DELETE FROM todoItems
    WHERE id = $1;
  `,

  alterItem: `
    ALTER TABLE todoitems
    DROP CONSTRAINT fk_category,
    ADD CONSTRAINT fk_category FOREIGN KEY (category_id)
        REFERENCES categories (category_id) ON DELETE CASCADE
  `,

  deleteCategory: `
    DELETE FROM categories
    WHERE category_id = $1;
  `,

  userExists: `
    SELECT user_id FROM users WHERE user_email = $1
  `,

  insertNewUser: `
    INSERT INTO users (user_email) VALUES ($1) RETURNING user_id
  `,

  insertNewCal: `
    INSERT INTO calendars (user_id, calendar_owner) VALUES ($1, $2) RETURNING calendar_id
  `
}
