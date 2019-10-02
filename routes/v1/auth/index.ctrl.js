import { findOne, update, signupUpdate, destroy } from '~/db/query';
import { Member } from '~/db/model';
import axios from 'axios';
import crypto from 'crypto';
import { aes } from '~/util/crypto';

export const login = async (req, res) => {
  const result = await findOne(req.user.id);
  const data = result.rows[0];
  //nickname 설정 안되어있으면 회원가입폼
  if (
    data.length == 0 ||
    data.nickname === '' ||
    data.blood === '' ||
    data.phone === ''
  ) {
    res.render('auth/terms', { status: true });
  } else {
    res.redirect('/');
  }
};

export const register = async (req, res) => {
  try {
    console.log('레지스터 과정', req.body);
    const user_input = new Member();
    for (let input in req.body) {
      let result = aes(req.body[input]);
      user_input[input] = result;
    }
    user_input.blood = user_input.blood === 'none' ? null : user_input.blood;
    user_input.id = req.user.id;
    const update_member = await signupUpdate(user_input);
    res.redirect('../user/mypage');
  } catch (err) {
    const arr = ['에러가 발생하였습니다. auth register', err];
    const response = await axios.post(process.env.SLACK_BOT_ERROR_URL, {
      text: arr.join('\n'),
    });
    console.log(err);
  }
};

export const logout = async (req, res) => {
  // req.logout();
  req.logout();
  req.session.destroy(function(err) {
    res.redirect('/');
  });
};

export const leave = async (req, res) => {
  try {
    if (req.user) {
      const id = req.user.id;
      const result = await findOne(id);
      const usernum = result.rows[0].usernum;
      if (usernum) {
        await destroy('member', `usernum=${usernum}`);
        req.logout();
        req.session.destroy(function(err) {
          res.json({ status: 'ok' });
        });
      } else {
        res.json({ status: 'no usernum' });
      }
    } else {
      res.json({ status: 'no user session' });
    }
  } catch (err) {
    const arr = ['에러가 발생하였습니다. leave', err];
    const response = await axios.post(process.env.SLACK_BOT_ERROR_URL, {
      text: arr.join('\n'),
    });
    console.log(err);
  }
};

export const request_off = async (req, res) => {
  const boardnum = req.body.request_off;
  try {
    const showUpdate = await update(
      'show_flag',
      "'0'::show_flag_t",
      'board',
      `WHERE boardnum = ${boardnum}`,
    );
  } catch (err) {
    const arr = ['에러가 발생하였습니다. auth/request off', err];
    const response = await axios.post(process.env.SLACK_BOT_ERROR_URL, {
      text: arr.join('\n'),
    });
    console.log('상태변경 실패', e);
  }
  res.redirect('../user/mypage');
};

export const request_complete = async (req, res) => {
  const boardnum = req.body.request_complete;
  try {
    const showUpdate = await update(
      'show_flag',
      "'3'::show_flag_t",
      'board',
      `WHERE boardnum = ${boardnum}`,
    );
  } catch (err) {
    const arr = ['에러가 발생하였습니다. auth/request complete', err];
    const response = await axios.post(process.env.SLACK_BOT_ERROR_URL, {
      text: arr.join('\n'),
    });
    console.log('상태변경 실패', e);
  }
  res.redirect('../user/mypage');
};

export const terms = async (req, res) => {
  res.render('auth/signup', { email: req.user._json.kaccount_email });
};

export const blood_change = async (req, res) => {
  console.log(req.body);
  try {
    const bloodUpdateValue = aes(req.body.blood);
    const usernum = req.body.usernum;
    const blood_changer = await update(
      'blood',
      `'${bloodUpdateValue}'`,
      'member',
      `WHERE usernum = ${usernum}`,
    );
  } catch (err) {
    const arr = ['에러가 발생하였습니다. auth/blood change', err];
    const response = await axios.post(process.env.SLACK_BOT_ERROR_URL, {
      text: arr.join('\n'),
    });
  }
  res.redirect('back');
};
