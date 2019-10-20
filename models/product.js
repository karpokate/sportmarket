const mongoose = require(mongoose);

//close schema (table)
const productSchema = mongoose.Schema({
    artikul : {
        type= String,
        require: true
    },
    productName : {
        type = String,
        require:  true
    },
    description : {
        type = String
    },
    image_url : {
        type = String
    },
    typeOf : {
        type = String,
        require = true
    },
    create_data : {
        type: Date,
		default: Date.now
    }



});

const Product = (module.exports = mongoose.model('Product', productSchema));
module.exports = Product;
