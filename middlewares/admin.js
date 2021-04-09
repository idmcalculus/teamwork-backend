
module.exports = (req, res, next) => {
	if (req.body.isAdmin === false) {
		return res.status(403).send('Oops! You are not allowed to perform this process');
	}
	next();
};