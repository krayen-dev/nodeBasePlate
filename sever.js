const app = require('./app');
const port = process.env.PORT || 5000;
// console.log(process.env.DATABASE_URL);

app.get('/', (req, res) => {
    res.json({ status: 'OK' });
});

app.listen(port, () => {
    console.log('Express server listening on port ' + port);
});
