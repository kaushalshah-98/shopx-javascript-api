const { app, bucket, niql } = require('../../config/connection');
const { CONSTANT } = require('../../shared/constant');

//Api to get the wishlist items of particular user
app.get('/getwishlistitems/:userid', async (req, res) => {
  const wishlist_id = 'WISHLIST::' + req.params.userid;
  const query = niql.fromString(
    `SELECT {items.product_id,items.qty,p.name,p.price,p.image,p.quantity} as wishlistitem
      FROM  ${CONSTANT.BUCKET_NAME}  a 
       USE KEYS ${wishlist_id}
       UNNEST a.wishlistitems as items
       JOIN  ${CONSTANT.BUCKET_NAME} 
       p ON KEYS [items.product_id]`
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
// //Api to get the wishlist size of particular user
app.get('/wishlistsize/:userid', async (req, res) => {
  const wishlist_id = 'WISHLIST::' + req.params.userid;
  const query = niql.fromString(
    `SELECT count(items) as wishlistsize
      FROM ${CONSTANT.BUCKET_NAME} a
      USE KEYS ${wishlist_id}
      UNNEST a.wishlistitems as items`
  );
  try {
    await bucket.query(query, [wishlist_id], async (err, row) => {
      if (err) {
        throw err;
      } else {
        // let wishlistsize = row.reduce((wishlistsize) => wishlistsize[0].wishlistsize);
        res.send(row);
      }
    });
  } catch (err) {
    res.send(err);
  }
});
// //Api to add product to wishlist
app.post('/AddToWishlist', async (req, res) => {
  const { product_id, userid } = req.body;
  const wishlist_id = 'WISHLIST::' + userid;

  const query = niql.fromString(`SELECT * FROM ${CONSTANT.BUCKET_NAME} USE KEYS '${wishlist_id}'`);
  try {
    await bucket.query(query, async (err, row) => {
      if (err) {
        throw err;
      } else if (row.length <= 0) {
        doc = {
          wishlistitems: [
            {
              product_id: product_id,
              qty: 1
            }
          ],
          userid: userid,
          type: 'WISHLIST'
        };
        await bucket.insert(wishlist_id, doc, (err, row) => {
          if (err) throw err;
        });
      } else {
        const query = niql.fromString(
          `SELECT items.qty
          FROM  ${CONSTANT.BUCKET_NAME} a 
          USE KEYS '${wishlist_id}'
          UNNEST a.wishlistitems items
          WHERE items.product_id = '${product_id}'
          AND a.type = '${CONSTANT.WISHLIST_TYPE}'`
        );
        await bucket.query(query, async (err, row) => {
          if (err) {
            throw err;
          } else if (row === null || row.length <= 0 || row === undefined) {
            let newitem = {
              product_id: product_id,
              qty: 1
            };
            const query = niql.fromString(
              `update ${CONSTANT.BUCKET_NAME}
               SET wishlistitems = ARRAY_APPEND( wishlistitems,${newitem}) 
               where userid = '${userid}' AND type = '${CONSTANT.WISHLIST_TYPE}'`
            );
            await bucket.query(query, (err, row) => {
              if (err) {
                throw err;
              } else {
                res.send();
              }
            });
          } else {
            let quantity = ++row[0].qty;
            let query = niql.fromString(
              `UPDATE ${CONSTANT.BUCKET_NAME} a
                SET item.qty = ${quantity}
                FOR item IN wishlistitems
                WHEN item.product_id = '${product_id}' 
                AND type = 'wishlist' AND a.userid = '${userid}' 
                END;`
            );
            await bucket.query(query, (err, row) => {
              if (err) {
                throw err;
              } else {
                res.send();
              }
            });
          }
        });
      }
    });
  } catch (err) {
    res.send(err);
  }
});
// //Api to empty wishlist of particular user
app.delete('/emptywishlist/:userid', async (req, res) => {
  const userid = req.params.userid;
  const wishlist_id = 'WISHLIST::' + userid;
  try {
    await bucket.remove(wishlist_id, (err, row) => {
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
// //Api to remove wishlistitem
app.post('/removewishlistitem/:userid', async (req, res) => {
  const { product_id } = req.body;
  const userid = req.params.userid;
  const wishlist_id = 'WISHLIST::' + userid;

  const query = niql.fromString(
    `UPDATE ${CONSTANT.BUCKET_NAME} a
      USE KEYS '${wishlist_id}'
      SET a.wishlistitems = ARRAY items FOR items IN a.wishlistitems
      WHEN items.product_id != '${product_id}'
      END`
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
  //method2
  // let query = niql.fromString(
  //     'UPDATE wishlist' +
  //     ' SET wishlistitems = ARRAY_REMOVE(wishlistitems,' +
  //     '{' +
  //     '  "product_id": "$1",' +
  //     '  "qty": $2' +
  //     '})' +
  //     'where userid = $3'
  // );
  // await bucket.query(query, [userid, quantity, product_id], (err, row) => {
  //     if (err) {
  //         errr = {
  //             Errorcode: err.errno,
  //             ErrorMessage: err.message,
  //             Status: err.code
  //         };
  //         res.send(errr)
  //     } else {
  //         res.send(row)
  //     }
  // });
});
// //Api to update wishlistitem
app.put('/updatewishlistitem/:userid', async (req, res) => {
  const { quantity, product_id } = req.body;
  const { userid } = req.params;
  const query = niql.fromString(
    `UPDATE ${CONSTANT.BUCKET_NAME} a
    SET item.qty = ${quantity}
    FOR item IN wishlistitems'
    WHEN item.product_id = '${product_id}'
    AND a.userid = '${userid}'
    END`
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
