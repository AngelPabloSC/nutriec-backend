const bcrypt = require('bcryptjs');

class EncryptionService {
    /**
     * Hash a password
     */
    async hash(password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    /**
     * Compare a password with a hash
     */
    async compare(password, hash) {
        return await bcrypt.compare(password, hash);
    }
}

module.exports = new EncryptionService();
