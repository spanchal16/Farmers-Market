module.exports.datastores = {
  default: {
    adapter: require('sails-mysql'),
    // url: 'mysql://root:password@localhost:3306/cloud',
    // url: 'mysql://beltran:B00847961@db.cs.dal.ca:3306/beltran',
    url: 'mysql://beltran:B00847961@database-2.cso32duu5tdh.us-east-1.rds.amazonaws.com:3306/cloud',
  }
};
