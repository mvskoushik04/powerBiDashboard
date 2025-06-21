const express = require('express');
const path = require('path');
const app = express();
const mysql2 = require('mysql2');
require('dotenv').config();

// DB connection
const database = mysql2.createConnection({
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

// Middleware
app.use(express.urlencoded({ extended: true }));

// 🚀 Serve index.html at root "/"
app.get('/', (req, res) => {
  const htmlfile = path.join(__dirname, 'index.html');
  res.sendFile(htmlfile);
});

// 🧾 Handle form submission → Insert into MySQL
app.post('/handleform', (req, res) => {
  try {
    const { Name, Marks, State, JoiningDate, NoOfSubjects } = req.body;
    const SQL_COMMAND =
      'INSERT INTO student_details (Name, Marks, State, JoiningDate, NoOfSubjects) VALUES (?, ?, ?, ?, ?)';
    database.query(
      SQL_COMMAND,
      [Name, Marks, State, JoiningDate, NoOfSubjects],
      (err, results) => {
        if (err) {
          console.error('Error inserting data:', err);
          return res.send('Registration Failed');
        }
        console.log('Data inserted successfully:', results);
        // 🔁 Redirect to the dashboard after submission (optional)
        res.redirect('/handleform');
      }
    );
  } catch (err) {
    console.error('Error processing form:', err);
    res.send('Error processing form');
  }
});

// 📊 Serve Power BI Dashboard on "/handleform"
app.get('/handleform', (req, res) => {
  const dashboardFile = path.join(__dirname, 'handleform.html');
  res.sendFile(dashboardFile);
});

// Start server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});