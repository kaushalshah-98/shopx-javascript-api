// const { app, port_no } = require('./connection');
const { app, port_no } = require('../config/connection');
//Importing the files
require('./UserManagement/usermanagement.js');
require('./ProductManagement/productmanagement.js');
require('./CartManagement/cartmanagement.js');

//Server created on port :-  3000
app.listen(port_no, () => console.log(`Server is Listening At Port ${port_no}....`));
