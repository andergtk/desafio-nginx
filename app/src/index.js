const http = require('http');
const mysql = require('mysql');
const faker = require('faker');
const port = 9000;

const connection = mysql.createConnection({
  host: 'db',
  user: 'root',
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

connection.connect();

const query = (...args) => {
  return new Promise((resolve, reject) => {
    connection.query(...args, (error, value) => {
      if (error) {
        reject(error);
      } else {
        resolve(value);
      }
    });
  });
};

const server = http.createServer(async (req, res) => {
  if (/favicon/.test(req.url)) {
    return res.end();
  }

  await query('INSERT INTO people SET ?', { name: faker.name.findName() });
  const people = await query('SELECT * FROM people');
  const names = people.map(p => p.name);
  const items = `<li>${names.join('</li><li>')}</li>`;
  res.end(`
    <h1>Full Cycle Rocks!</h1>
    <ul>${items}</ul>
  `);
});

server.listen(port, () => {
  console.log(`Server running on localhost:${port}`);
});