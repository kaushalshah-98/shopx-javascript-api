const { app, bucket, niql, uuid } = require('../../config/connection');
const { CONSTANT } = require('../../shared/constant');

//Api to Fetch all product details
app.get('/getallproducts', async (req, res) => {
  const query = niql.fromString(
    `SELECT ${CONSTANT.BUCKET_NAME} as product 
      FROM  ${CONSTANT.BUCKET_NAME} 
      WHERE type = '${CONSTANT.PRODUCT_TYPE}'`
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
//Api to add a Product
app.post('/addproduct', async (req, res) => {
  let productdoc = req.body;
  let product_id = 'PRODUCT::' + uuid.v4();
  productdoc.product_id = product_id;
  productdoc.type = 'PRODUCT';
  // method 1
  try {
    await bucket.insert(product_id, productdoc, (err, row) => {
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
// Api to remove a product
app.delete('/removeproduct/:productid', async (req, res) => {
  const product_id = req.params.productid;
  try {
    await bucket.remove(product_id, (err, row) => {
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
// Api to get a product
app.get('/getproduct/:productid', async (req, res) => {
  const product_id = req.params.productid;
  const query = niql.fromString(
    `SELECT ${CONSTANT.BUCKET_NAME} as product 
      FROM  ${CONSTANT.BUCKET_NAME} 
      USE KEYS '${product_id}'`
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
//Api for Updating a product
app.put('/updateproduct/:productid', async (req, res) => {
  const { product_id } = req.params;
  const { name, password, email, profilepic } = req.body;
  const query = niql.fromString(
    `UPDATE ${CONSTANT.BUCKET_NAME}
      USE KEYS '${product_id}'
      set name='${name}',\`password\` = '${password}', 
      email= '${email}',profilepic ='${profilepic}'
     WHERE type = '${CONSTANT.USER_TYPE}'`
  );
  try {
    await bucket.query(query, async (err, row) => {
      if (err) {
        throw err;
      } else {
        await bucket.get(product_id, (err, rows) => {
          if (err) {
            throw err;
          } else {
            res.send(rows);
          }
        });
      }
    });
  } catch (err) {
    res.send(err);
  }
});
