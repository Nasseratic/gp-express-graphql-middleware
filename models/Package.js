var mongoose = require('mongoose');

// role Schema 
var Package = mongoose.Schema({
    services:{
        type: Array
    },
});

module.exports = mongoose.model('role', roleSchema )