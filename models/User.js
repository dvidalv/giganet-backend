const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		role: {
			type: String,
			enum: ['admin', 'user'],
			default: 'user',
		},
		password: {
			type: String,
			required: true,
			minlength: 4,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		collection: 'usuarios',
	}
);

// Añadir método estático para verificar límite de admins
userSchema.statics.checkAdminLimit = async function (role) {
	if (role === 'admin') {
		const adminCount = await this.countDocuments({ role: 'admin' });
		const ADMIN_LIMIT = 1; // Puedes ajustar este número según necesites
		if (adminCount >= ADMIN_LIMIT) {
			throw new Error(
				`No se pueden crear más administradores. Límite: ${ADMIN_LIMIT}`
			);
		}
	}
};

// Middleware pre-save para verificar el límite
userSchema.pre('save', async function (next) {
	if (this.isNew) {
		await this.constructor.checkAdminLimit(this.role);
	}
	next();
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
