const mongoose = require('mongoose');

// role Schema 
const Package = mongoose.Schema({
    services:{
        type: Array
    },
});

module.exports = mongoose.model('role', roleSchema )