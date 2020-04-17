const mg = require("../lib/mongoose");
const Gist = mg.model('Gist', {
    name: { type: String },
    type: { type: String },
    code: { type: String },
    author_id: { type: String },
    created_at: { type: String }
});

module.exports = Gist;