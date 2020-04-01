const { app, bucket, niql, uuid } = require('../connection')

//Api for verifying the user
app.post('/verifyuser', async (req, res) => {
  const { name, password } = req.body
  const query = niql.fromString(
    'select ' +
      bucket._name +
      ' `user` from ' +
      bucket._name +
      ' where name= $1 and `password`= $2'
  )
  try {
    await bucket.query(query, [name, password], (err, row) => {
      if (err) {
        throw err
      } else if (row == undefined || row == null || row.length <= 0)
        res.send(row)
      else res.send(row[0].user)
    })
  } catch (err) {
    res.send(err)
  }
})
//Api for Updating the user data
app.post('/updateuserdata', async (req, res) => {
  const { userid, name, password, email, phone } = req.body
  const query = niql.fromString(
    'UPDATE ' +
      bucket._name +
      ' USE KEYS $1' +
      'set name=$2,`password`=$3,email= $4,phone= $5' +
      "where type='user'"
  )
  try {
    await bucket.query(
      query,
      [userid, name, password, email, phone],
      async (err, row) => {
        if (err) {
          throw err
        } else {
          await bucket.get(userid, (err, rows) => {
            if (err) {
              throw err
            } else {
              res.send(rows.value)
            }
          })
        }
      }
    )
  } catch (err) {
    res.send(err)
  }
})
//Api for Creating the user
app.post('/createuser', async (req, res) => {
  const userdoc = req.body
  const userid = 'user::' + uuid.v4()
  userdoc.userid = userid
  userdoc.permissions = 'no'
  userdoc.type = 'user'
  // method 1
  try {
    await bucket.insert(userid, userdoc, (err, row) => {
      if (err) {
        throw err
      } else {
        res.send()
      }
    })
  } catch (err) {
    res.send(err)
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
})
