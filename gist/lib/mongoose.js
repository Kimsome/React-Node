const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodegist', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if (err) {
        console.log("db error...");
        process.exit();
    }
});

module.exports = mongoose;