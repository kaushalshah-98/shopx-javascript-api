const { app, bucket, niql, uuid } = require('../../config/connection');
const { sendmail } = require('../Other-functions/sharedfunctions');
const { CONSTANT } = require('../../shared/constant');

//Api for fetching Al users
app.get('/getallusers', async (req, res) => {
  const query = niql.fromString(
    `SELECT ${CONSTANT.BUCKET_NAME} as users 
    FROM  ${CONSTANT.BUCKET_NAME} 
    WHERE type = '${CONSTANT.USER_TYPE}'`
  );
  try {
    await bucket.query(query, (err, row) => {
      if (err) {
        throw err;
      } else {
        res.send(row);
      }
    });
  } catch (err) {
    res.send(err);
  }
});
//Api for Blocking the user
app.put('/blockuser/:userid', async (req, res) => {
  const userid = req.params.userid;
  const { status } = req.body;
  const query = niql.fromString(
    `UPDATE ${CONSTANT.BUCKET_NAME}
      USE KEYS '${userid}'
      set status='${status}'
     WHERE type = '${CONSTANT.USER_TYPE}'`
  );
  try {
    await bucket.query(query, async (err, row) => {
      if (err) {
        throw err;
      } else {
        res.send(row);
      }
    });
  } catch (err) {
    res.send(err);
  }
});
