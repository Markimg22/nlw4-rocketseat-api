import express from 'express';

const app = express();

app.get('/', (req, res) => {
  return res.json({ name: 'Marcos', lastName: 'Campos' });
});

app.post('/');

app.listen(3333, () => {
  console.log('Server is running!');
});
