import { Singleton } from '~/db';
import axios from 'axios';
export const select = async (
  object,
  table,
  where,
  add = '',
  add2 = '',
  ps = '',
) => {
  try {
    const instance = new Singleton();
    const result = await instance.query(
      `SELECT ${object} FROM ${table} ${add} WHERE ${where} ${add2}`,
      ps,
    );
    return result;
  } catch (err) {
    const arr = [
      '에러가 발생하였습니다. select query',
      err.stack,
      `SELECT ${object} FROM ${table} ${add} WHERE ${where} ${add2}`,
    ];
    const response = await axios.post(process.env.SLACK_BOT_ERROR_URL, {
      text: arr.join('\n'),
    });
    console.log(err);
    err.message = arr.join('\n');
    throw new Error(err);
  }
};

export const findOne = async (where) => {
  try {
    const instance = new Singleton();
    const result = await instance.query(`SELECT * FROM member WHERE id=$1`, [
      where,
    ]);
    return result;
  } catch (err) {
    const arr = [
      '에러가 발생하였습니다. findone query',
      err.stack,
      `SELECT * FROM member WHERE id='${where}'`,
    ];
    const response = await axios.post(process.env.SLACK_BOT_ERROR_URL, {
      text: arr.join('\n'),
    });
    console.log(err);
    err.message = arr.join('\n');
    throw new Error(err);
  }
};

export const insert = async (object, table, add = '', order = '', ps = '') => {
  try {
    const instance = new Singleton();
    console.log('쿼리', `INSERT INTO ${table}${order}  VALUES (${object})`);
    const result = await instance.query(
      `INSERT INTO ${table}${order} VALUES (${object}) ${add}`,
      ps,
    );

    return result;
  } catch (err) {
    const arr = [
      '에러가 발생하였습니다. insert query',
      err.stack,
      `INSERT INTO ${table}${order} VALUES (${object}) ${add}`,
    ];
    const response = await axios.post(process.env.SLACK_BOT_ERROR_URL, {
      text: arr.join('\n'),
    });
    console.log(err);
    err.message = arr.join('\n');
    throw new Error(err);
  }
};

export const update = async (
  object,
  ToBEObject,
  table,
  where = '',
  ps = '',
) => {
  try {
    const instance = new Singleton();
    const result = await instance.query(
      `UPDATE ${table} SET ${object} = ${ToBEObject} ${where}`,
      ps,
    );

    return result;
  } catch (err) {
    const arr = [
      '에러가 발생하였습니다. update query',
      err.stack,
      `UPDATE ${table} SET ${object} = ${ToBEObject} ${where}`,
    ];
    const response = await axios.post(process.env.SLACK_BOT_ERROR_URL, {
      text: arr.join('\n'),
    });
    err.message = arr.join('\n');
    throw new Error(err);
  }
};

export const signupUpdate = async (user_input) => {
  try {
    const instance = new Singleton();
    const query = `UPDATE member SET nickname = $1, blood = $2,phone = $3, my_blood = $4, email = $5 WHERE id = $6`;
    const result = await instance.query(query, [
      user_input.nickname,
      user_input.blood,
      user_input.phone,
      user_input.my_blood,
      user_input.email,
      user_input.id,
    ]);
    return result;
  } catch (err) {
    const arr = [
      '에러가 발생하였습니다. signupUpdate query',
      err.stack,
      `UPDATE member SET nickname = '${user_input.nickname}', blood = '${user_input.blood}', phone = '${user_input.phone}' WHERE id = '${user_input.id}'`,
    ];
    const response = await axios.post(process.env.SLACK_BOT_ERROR_URL, {
      text: arr.join('\n'),
    });
    err.message = arr.join('\n');
    throw new Error(err);
  }
};

export const destroy = async (table, where = '', ps = '') => {
  try {
    const instance = new Singleton();
    const result = await instance.query(
      `DELETE FROM ${table} WHERE ${where}`,
      ps,
    );
    return result;
  } catch (err) {
    const arr = [
      '에러가 발생하였습니다. destroy query',
      err.stack,
      `DELETE FROM ${table} WHERE ${where}`,
    ];
    const response = await axios.post(process.env.SLACK_BOT_ERROR_URL, {
      text: arr.join('\n'),
    });
    console.log(err);
    err.message = arr.join('\n');
    throw new Error(err);
  }
};
