const authRoutes = require('./auth.route');
const adminRoutes = require('./admin.route');
const userRoutes = require('./user.route');
const transactionRoutes = require('./transaction.route');

const routes = {
  authRoutes,
  adminRoutes,
  userRoutes,
  transactionRoutes,
};

module.exports = routes;
