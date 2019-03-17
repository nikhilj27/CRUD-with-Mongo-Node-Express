const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/EmployeeData', { useNewUrlParser: true }, (err) => {
    if (!err) {
        console.log('MongoDB connection succeed...');
    } else {
        console.log('Error while connecting Database..');
    }
});

require('./employee.model');