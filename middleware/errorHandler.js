// middleware/errorHandler.js
module.exports = (err, req, res, next) => {
    console.error('❌ Server error:', err.message);
    res.status(500).render('pages/error', {
      user: req.session.user,
      error: 'Something went wrong on the server. Please try again later. 😕',
    });
  };