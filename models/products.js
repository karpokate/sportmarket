const mongoose = require('mongoose');

//close schema (table)
const productSchema = mongoose.Schema({
    artikul : {  //smth like id 
        type= String,
        require: true
    },
    productName : {
        type = String,
        require:  true
    },
    brand : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'brand'
    },
    category : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categoties'
    },
    description : {
        type = String
    },
    image_url : {
        type = String
    },
    price : {
        type: String
    },
    create_data : {
        type: Date,
		default: Date.now
    }
});

const Product = (module.exports = mongoose.model('Product', productSchema));
module.exports = Product;
