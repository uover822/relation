let Seneca = require('seneca')
Seneca({tag: 'relation', timeout: 5000})
  //.test('print')
  .use('../relation.js')
  .listen(8040)
  .client({pin:'role:store', port:8045})