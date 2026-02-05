const jwt = require('jsonwebtoken');

class TokenService {
    constructor() {
        this.secret = process.env.JWT_SECRET || 'default_secret_please_change';
        this.expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    }

    generate(payload) {
        return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
    }

    verify(token) {
        return jwt.verify(token, this.secret);
    }
}

module.exports = TokenService;
