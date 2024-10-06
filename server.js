const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3030;

// Middleware to serve static files (CSS, JS, Images)
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Path to the JSON file that will store user data
const usersFilePath = path.join(__dirname, 'users.json');

// Route to serve main HTML file
app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for user registration
app.post('/register', (req, res) => {
    const { fullName, username, email, phone, password } = req.body;

    // Read the existing users file
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
       if (err) {
          // If there's an error reading the file, return an empty array as the users list
          console.log('Error reading file:', err);
          return res.status(500).send('Server error');
       }

       let users = [];
       try {
          // Try to parse the file content
          users = JSON.parse(data || '[]'); // Use empty array if data is null or undefined
       } catch (parseErr) {
          console.log('Error parsing JSON:', parseErr);
          return res.status(500).send('Server error');
       }

       // Check if the user already exists
       const userExists = users.find(user => user.username === username);
       if (userExists) {
          return res.send('User already exists');
       }

       // Add the new user
       users.push({ fullName, username, email, phone, password });

       // Save the updated user data
       fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
          if (err) {
             console.log('Error writing file:', err);
             return res.status(500).send('Server error');
          }
        // Inside your /register route, replace the success response with this:
            res.send(`
               <h2>Registration successful</h2>
               <script>
                  setTimeout(() => {
                     window.location.href = '/#login';
                  }, 2000); // Redirect to login after 2 seconds
               </script>
            `);
       });
    });
});

// Route for user login
app.post('/login', (req, res) => {
   const { username, password } = req.body;

   // Read the users file
   fs.readFile(usersFilePath, (err, data) => {
      if (err) throw err;
      let users = JSON.parse(data || '[]');

      // Find the user
      const user = users.find(user => user.username === username && user.password === password);

      if (user) {
         res.send('Login successful, Thank you for using our website');
      } else {
         res.send(`
            <h2>Wrong credentials, login again</h2>
            <a href="/#login">Go to Login</a>
         `);
      }
   });
});

// Start the server
app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
