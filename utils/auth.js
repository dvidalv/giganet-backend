function autenticar(req, res, next) {
	console.log('autenticando...');
	next();
}

module.exports = {
	autenticar,
};
