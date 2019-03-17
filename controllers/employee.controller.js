const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');

router.get('/', (req, res) => {
    res.render('employee/addOrEdit', {
        viewTitle: 'Insert Employee'
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '') {
        insertRecord(req, res);
    } else {
        updateRecord(req, res);
    }
});

function updateRecord(req, res) {
    Employee.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) {
            res.redirect('employee/list');
        } else {
            if (err.name == 'ValidatioError') {
                handleValidationError(err, req.body);
                res.render('employee/addOrEdit', {
                    viewTitle: 'Update Employee',
                    employee: req.body
                });
            }
        }
    })
}

function insertRecord(req, res) {
    var employee = new Employee();
    employee.fullName = req.body.fullName;
    employee.email = req.body.email;
    employee.contact = req.body.contact;
    employee.city = req.body.city;
    employee.save((err, docs) => {
        if (!err) {
            res.redirect('employee/list');
        } else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render('employee/addOrEdit', {
                    viewTitle: 'Insert Employee',
                    employee: req.body
                });
            }
            console.log('Error while Inserting Record: ' + err);
        }
    });
}

function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;

            case 'email':
                body['emailError'] = err.errors[field].message;
                break;

            default:
                break;
        }
    }
}

router.get('/list', (req, res) => {
    Employee.find((err, docs) => {
        res.render('employee/list', {
            list: docs
        })
    })
});


router.get('/:id', (req, res) => {
    Employee.findById(req.params.id, (err, docs) => {
        if (!err) {
            res.render('employee/addOrEdit', {
                viewTitle: 'Update Employee',
                employee: docs
            })
        }
    })
})

router.get('/delete/:id', (req, res) => {
    Employee.findByIdAndDelete(req.params.id, (err, docs) => {
        if (!err) {
            res.redirect('/employee/list');
        } else {
            console.log('Error while deleting employee:' + err);
        }
    })
})

module.exports = router;