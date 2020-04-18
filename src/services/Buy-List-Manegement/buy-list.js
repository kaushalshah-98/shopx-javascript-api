const { app, bucket, niql } = require('../../config/connection');
const { CONSTANT } = require('../../shared/constant');

//Api to get the wishlist items of particular user
app.get('/getbuylistitems/:userid', async (req, res) => {
  const buylist_id = 'BUYLIST::' + req.params.userid;
  const query = niql.fromString(
    `SELECT list
    FROM  ${CONSTANT.BUCKET_NAME}  
    USE KEYS ${buylist_id}`
  );
  try {
    await bucket.query(query, (err, row) => {
      if (err) {
        throw err;
      } else if (row.length <= 0) {
        res.send(row);
      } else {
        res.send(row);
      }
    });
  } catch (err) {
    res.send(err);
  }
});

//Api for Creating the user
app.post('/addtolist/:userid', async (req, res) => {
  const buylist_id = 'BUYLIST::' + req.params.userid;
  const listdoc = req.body;
  listdoc.userid = userid;
  listdoc.type = 'BUYLIST';
  // method 1
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
  //method 2
  // let query = niql.fromString("INSERT INTO `user` (KEY,VALUE) VALUES ($1, $2)");
  // console.log(query);
  // user_await bucket.query(query, [userid, userdoc], (err, row) => {
  //     if (err) {
  //         errr = {
  //             Errorcode: err.errno,
  //             ErrorMessage: err.message,
  //             Status: err.code
  //         };
  //         res.send(errr)
  //         console.log(err)
  //     } else {
  //         console.log(row);
  //     }
  // });
});
