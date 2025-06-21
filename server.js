const express= require('express');
const path = require('path');
const app = express();
const mysql2 = require('mysql2');

const database =mysql2.createConnection({
    host:"127.0.0.1",
    user:"root",
    password:"Koushik@4",
    database:"student_data"
});

database.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    const htmlfile=path.join(__dirname, 'index.html');
    res.sendFile(htmlfile);
})

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