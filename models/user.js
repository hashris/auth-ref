const mongoose      =   require('mongoose');

const bcrypt        =   require('bcrypt');
const saltRounds    =   10;

// Define login user schema - Normal + google
const userSchema    =   mongoose.Schema({
    local           :   {
        email       :   String,
        password    :   String
    },
    google          :   {
        id          :   String,
        token       :   String,
        email       :   String,
        name        :   String
    }
});

// Hash generation
userSchema.methods.generateHash     =   (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds), null);
};

// Check if valid password
userSchema.methods.validPassword    =   function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports      =   mongoose.model('User', userSchema);