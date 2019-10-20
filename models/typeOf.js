const mongoose = require('mongoose');


const typeOfSchema = mongoose.Schema({
    typeOf : {
        type = String,
        require = true
    },
    create_data: {
        type: Date,
		default: Date.now
    }
})

const typeOf = module.exports = mongoose.model('typeOf', typeOfSchema);
module.exports = typeOf;