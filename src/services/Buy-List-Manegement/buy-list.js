const { app, bucket, niql } = require('../../config/connection');
const { CONSTANT } = require('../../shared/constant');

app.get('/getbuylistitems/:userid', async (req, res) => {
  const buylist_id = 'BUYLIST::' + req.params.userid;
  const query = niql.fromString(
    `SELECT list
    FROM  ${CONSTANT.BUCKET_NAME}  
    USE KEYS '${buylist_id}'`
  );
  try {
    await bucket.query(query, (err, row) => {
      if (err) {
        throw err;
      } else if (row.length <= 0) {
        res.send(row);
      } else {
        res.send(row[0].list);
      }
    });
  } catch (err) {
    res.send(err);
  }
});

app.post('/addtolist/:userid', async (req, res) => {
  const buylist_id = 'BUYLIST::' + req.params.userid;
  const listarray = req.body;
  const listdoc = {
    list: listarray,
    userid: req.params.userid,
    type: 'BUYLIST'
  };
  try {
    await bucket.upsert(buylist_id, listdoc, (err, row) => {
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
