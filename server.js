const { createServer } = require('./app');
createServer().listen(3000, () => console.log('CloudNotes listening on 3000'));
