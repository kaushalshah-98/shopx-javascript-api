const { app, bucket, niql, uuid } = require('../../config/connection');
const { CONSTANT } = require('../../shared/constant');

//Api to Fetch all product details
app.get('/getallproducts', async (req, res) => {
  const query = niql.fromString(
    'SELECT ' + bucket._name + ' as product FROM ' + bucket._name + " where type ='product'"
  );
  try {
    await await bucket.query(query, [], (err, row) => {
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
//Api to add a Product
app.post('/addproduct', async (req, res) => {
  let productdoc = req.body;
  let productid = 'product::' + uuid.v4();
  productdoc.productid = productid;
  productdoc.type = 'product';
  // method 1
  try {
    await bucket.insert(productid, productdoc, (err, row) => {
      if (err) {
        throw err;
      } else {
        res.send();
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
// Api to remove a product
app.delete('/removeproduct/:productid', async (req, res) => {
  const { productid } = req.params;
  try {
    await bucket.remove(productid, (err, row) => {
      if (err) {
        throw err;
      } else {
        res.send();
      }
    });
  } catch (err) {
    res.send(err);
  }
});
