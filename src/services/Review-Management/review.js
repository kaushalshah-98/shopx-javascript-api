const { app, bucket, niql } = require('../../config/connection');
const { CONSTANT } = require('../../shared/constant');

//Api to get the wishlist items of particular user
app.get('/getreviews/:product_id', async (req, res) => {
  const review_id = 'REVIEW::' + req.params.product_id;
  const query = niql.fromString(
    `SELECT list
    FROM  ${CONSTANT.BUCKET_NAME}  
    USE KEYS '${review_id}'`
  );
  console.log(query);
  try {
    await bucket.query(query, (err, row) => {
      if (err) {
        throw err;
      } else if (row.length <= 0) {
        res.send(row);
      } else {
        // let response = row.map((item) => item.list);
        // console.log(response[0]);
        res.send(row[0].list);
      }
    });
  } catch (err) {
    res.send(err);
  }
});

//Api for Creating the user
app.post('/addreview/:product_id', async (req, res) => {
  const review_id = 'REVIEW::' + req.params.product_id;
  const reviewarray = req.body;
  const doc = {
    list: reviewarray,
    product_id: req.params.product_id,
    type: 'REVIEW'
  };
  console.log(doc);
  // method 1
  try {
    await bucket.upsert(review_id, doc, (err, row) => {
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
