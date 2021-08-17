const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');

const db = require('../lib/db');

router.post('/sign-up', (req, res, next) => {
  db.query(
    `SELECT id FROM users WHERE LOWER(email)=LOWER(${db.escape(
      req.body.email
    )})`,
    (err, result) => {
      if (result.length) {
        console.log(result);

        return res.status(409).send({
          message: 'This email is already taken'
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            throw err;
            return res.status(500).send({
              message: 'error'
            });
          } else {
            db.query(
              `INSERT INTO users (id,username,email,password,country,state,phone,registered) VALUES ('${uuid.v4()}','${
                req.body.username
              }','${req.body.email}','${hash}','${req.body.country}','${
                req.body.state
              }','${req.body.phone}',now());`,
              (err, result) => {
                if (err) {
                  throw err;
                  return res.status(400).send({
                    message: 'error'
                  });
                }

                return res.status(201).send({
                  message: 'Registered'
                });
              }
            );
          }
        });
      }
    }
  );
});

router.post('/login', (req, res, next) => {
  db.query(
    `SELECT * FROM users WHERE LOWER(email)=LOWER(${db.escape(
      req.body.email
    )})`,
    (err, result) => {
      console.log(result);
      if (err) {
        throw err;
        return res.status(400).send({
          message: err
        });
      }
      if (!result.length) {
        return res.status(400).send({
          message: 'email or Password incorrect'
        });
      }

      bcrypt.compare(req.body.password, result[0].password, (bErr, bResult) => {
        if (bErr) {
          throw bErr;
          return res.status(400).send({
            message: 'Username or password incorrect'
          });
        }
        if (bResult) {
          const token = jwt.sign(
            {
              email: result[0].email
            },
            'SECRETKEY',
            { expiresIn: '7d' }
          );

          return res.status(200).send({
            message: 'Logged in',
            token: token,
            user: result[0]
          });
        }
        return res.status(400).send({
          message: 'email or Password incorrect'
        });
      });
    }
  );
});

module.exports = router;
