const { default: mongoose } = require ('mongoose');

const dbConnect = () => {
    try{
        const conn = mongoose.connect(process.env.MONGODB_URL)
        console.log('Database connect successsfuly')
    }catch(err){
        console.log(err, 'DataBase not connect')
    }
};

module.exports = dbConnect;