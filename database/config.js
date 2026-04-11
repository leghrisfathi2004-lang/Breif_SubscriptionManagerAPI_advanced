const mongoose = require('mongoose');

//connexion:
const connectionDB = async () => {
    try{
        await mongoose.connect(process.env.mongoURL);
        console.log('DB connected successfuly!');

    }catch(e){
        console.error('DB connection error: ', e.message);
    }
}

module.exports = {connectionDB}