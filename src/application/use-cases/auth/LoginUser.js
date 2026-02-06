class LoginUser {
    constructor(cosmosDbRepository, encryptionService, tokenService) {
        this.cosmosDbRepository = cosmosDbRepository;
        this.encryptionService = encryptionService;
        this.tokenService = tokenService;
    }

    async execute({ email, password }) {
        // 1. Find user by email
        const user = await this.cosmosDbRepository.findUserByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // 2. Validate password
        const isValid = await this.encryptionService.compare(password, user.password);
        if (!isValid) {
            throw new Error('Invalid credentials');
        }

        // 3. Generate Token
        // Generate token with user ID and Role
        const token = this.tokenService.generate({
            id: user.id,
            role: user.role
        });

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;

        return {
            success: true,
            data: userWithoutPassword,
            token: token
        };
    }
}

module.exports = LoginUser;
