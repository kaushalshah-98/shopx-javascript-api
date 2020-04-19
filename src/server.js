const { app, port_no } = require('./config/connection');

//Importing the files
require('./services/User-Management/usermanagement');
require('./services/Product-Management/productmanagement');
require('./services/Cart-Management/cartmanagement');
require('./services/Admin-Management/adminmanagement');
require('./services/Theme-Management/theme');
require('./services/Buy-List-Manegement/buy-list');

//Server created on port :-  3000
app.listen(port_no, () => console.log(`Server is Listening At Port ${port_no}....`));
