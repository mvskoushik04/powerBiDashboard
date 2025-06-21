const express= require('express');
const path = require('path');
const app = express();
const mysql2 = require('mysql2');
require('dotenv').config();

const database =mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

database.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

app.use(express.urlencoded({ extended: true }))

app.get('/handleform', (req, res) => {
    const dashboardFile = path.join(__dirname, 'handleform.html');
    res.sendFile(dashboardFile);
});


app.post('/handleform',(req,res) => {
    try{
        const {Name,Marks,State,JoiningDate,NoOfSubjects}= req.body;
        const SQL_COMMAND = 'INSERT INTO student_details (Name, Marks, State, JoiningDate, NoOfSubjects) VALUES (?, ?, ?, ?, ?)';
        database.query(SQL_COMMAND, [Name, Marks, State, JoiningDate, NoOfSubjects],(err, results) => {
            if (err){
                console.error(err);
                return res.send('Registration Successful');
            }
            console.log('Data inserted successfully:', results);
            res.send('Registration Successful');
        })
    }
    catch(err){
        console.error('Error processing form:', err);
        res.send('Error processing form');
    }
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
}); 