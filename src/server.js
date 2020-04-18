const { app, port_no } = require('./config/connection');
//Importing the files
require('./services/UserManagement/usermanagement');
require('./services/ProductManagement/productmanagement');
require('./services/CartManagement/cartmanagement');
require('./services/AdminManagement/adminmanagement');


//Server created on port :-  3000
app.listen(port_no, () => console.log(`Server is Listening At Port ${port_no}....`));
