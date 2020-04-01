const { app, bucket, niql } = require('../connection')

//Api to get the cart items of particular user
app.get('/getcartitems/:userid', async (req, res) => {
  const cartid = 'cart::' + req.params.userid
  const query = niql.fromString(
    'SELECT {items.productid,items.qty,p.name,p.price,p.image,p.quantity} as cartitem' +
      ' FROM ' +
      bucket._name +
      ' a' +
      ' USE KEYS $1' +
      ' UNNEST a.cartitems as items' +
      ' JOIN ' +
      bucket._name +
      ' p ON KEYS [items.productid]'
  )
  try {
    await bucket.query(query, [cartid], (err, row) => {
      if (err) {
        throw err
      } else if (row.length <= 0) {
        res.send(row)
      } else {
        res.send(row)
      }
    })
  } catch (err) {
    res.send(err)
  }
})
// //Api to get the cart size of particular user
app.get('/cartsize/:userid', async (req, res) => {
  const cartid = 'cart::' + req.params.userid

  const query = niql.fromString(
    'SELECT count(items) as cartsize' +
      ' FROM ' +
      bucket._name +
      ' a' +
      ' USE KEYS $1' +
      ' UNNEST a.cartitems as items'
  )
  try {
    await bucket.query(query, [cartid], async (err, row) => {
      if (err) {
        throw err
      } else {
        let cartsize = row.reduce((cartsize) => cartsize[0].cartsize)
        res.send(cartsize)
      }
    })
  } catch (err) {
    res.send(err)
  }
})
// //Api to add product to cart
app.post('/AddTocart', async (req, res) => {
  const { productid, userid } = req.body
  const cartid = 'cart::' + userid

  const query = niql.fromString(
    ' SELECT *' + ' FROM ' + bucket._name + '' + ' USE KEYS $1'
  )
  try {
    await bucket.query(query, [cartid], async (err, row) => {
      if (err) {
        throw err
      } else if (row === null || row.length <= 0 || row === undefined) {
        doc = {
          cartitems: [
            {
              productid: productid,
              qty: 1,
            },
          ],
          userid: userid,
          type: 'cart',
        }
        await bucket.insert(cartid, doc, (err, row) => {
          if (err) throw err
        })
      } else {
        const query = niql.fromString(
          'SELECT items.qty' +
            ' FROM ' +
            bucket._name +
            ' a' +
            ' USE KEYS $1' +
            ' UNNEST a.cartitems items' +
            " WHERE items.productid=$2 and a.type='cart'"
        )
        await bucket.query(query, [cartid, productid], async (err, row) => {
          if (err) {
            throw err
          } else if (row === null || row.length <= 0 || row === undefined) {
            let newitem = {
              productid: productid,
              qty: 1,
            }
            const query = niql.fromString(
              'update ' +
                bucket._name +
                '' +
                ' SET cartitems = ARRAY_APPEND( cartitems,$1)' +
                " where userid = $2 and type='cart'"
            )
            await bucket.query(query, [newitem, userid], (err, row) => {
              if (err) {
                throw err
              } else {
                res.send()
              }
            })
          } else {
            let quantity = ++row[0].qty
            let query = niql.fromString(
              'update ' +
                bucket._name +
                ' a' +
                ' SET item.qty = $1' +
                ' FOR item IN cartitems' +
                ' WHEN item.productid = $2 AND' +
                " type = 'cart' AND a.userid = $3" +
                ' END;'
            )
            await bucket.query(
              query,
              [quantity, productid, userid],
              (err, row) => {
                if (err) {
                  throw err
                } else {
                  res.send()
                }
              }
            )
          }
        })
      }
    })
  } catch (err) {
    res.send(err)
  }
})
// //Api to empty cart of particular user
app.delete('/emptycart/:userid', async (req, res) => {
  const { userid } = req.params
  const cartid = 'cart::' + userid
  try {
    await bucket.remove(cartid, (err, row) => {
      if (err) {
        throw err
      } else {
        res.send(row)
      }
    })
  } catch (err) {
    res.send(err)
  }
})
// //Api to remove cartitem
app.post('/removecartitem/:userid', async (req, res) => {
  const { productid } = req.body
  const { userid } = req.params
  const cartid = 'cart::' + userid

  const query = niql.fromString(
    'UPDATE ' +
      bucket._name +
      ' a' +
      ' USE KEYS $1' +
      ' SET a.cartitems = ARRAY items FOR items IN a.cartitems ' +
      ' WHEN items.productid != $2' +
      ' END'
  )
  try {
    await bucket.query(query, [cartid, productid], (err, row) => {
      if (err) {
        throw err
      } else {
        res.send(row)
      }
    })
  } catch (err) {
    res.send(err)
  }
  //method2
  // let query = niql.fromString(
  //     'UPDATE cart' +
  //     ' SET cartitems = ARRAY_REMOVE(cartitems,' +
  //     '{' +
  //     '  "productid": "$1",' +
  //     '  "qty": $2' +
  //     '})' +
  //     'where userid = $3'
  // );
  // await bucket.query(query, [userid, quantity, productid], (err, row) => {
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
})
// //Api to update cartitem
app.put('/updatecartitem/:userid', async (req, res) => {
  const { quantity, productid } = req.body
  const { userid } = req.params
  const query = niql.fromString(
    'update ' +
      bucket._name +
      ' a' +
      ' SET item.qty = $1' +
      ' FOR item IN cartitems' +
      ' WHEN item.productid = $2 AND' +
      ' a.userid = $3' +
      ' END'
  )
  try {
    await bucket.query(query, [quantity, productid, userid], (err, row) => {
      if (err) {
        throw err
      } else {
        res.send(row)
      }
    })
  } catch (err) {
    res.send(err)
  }
})
