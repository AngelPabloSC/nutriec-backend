const User = require('../../domain/entities/User');

class RegisterUser {
    constructor(cosmosDbRepository, blobStorageRepository, encryptionService, tokenService) {
        this.cosmosDbRepository = cosmosDbRepository;
        this.blobStorageRepository = blobStorageRepository;
        this.encryptionService = encryptionService;
        this.tokenService = tokenService;
    }

    async execute({ name, email, password, image }) {
        // 1. Check if user already exists
        const existingUser = await this.cosmosDbRepository.findUserByEmail(email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // 2. Hash password
        const hashedPassword = await this.encryptionService.hash(password);

        // 3. Create user ID
        const userId = Date.now().toString();
        let profileImageUrl = null;

        // 4. Upload image if provided
        if (image) {
            const blobName = `users/${userId}/profile/avatar.png`;
            const uploadResult = await this.blobStorageRepository.uploadBase64(blobName, image);
            profileImageUrl = uploadResult.url;
        }

        // 5. Create user entity
        const user = new User({
            id: userId,
            name,
            email,
            password: hashedPassword,
            profileImageUrl,
            role: 'user',
            createdAt: new Date().toISOString()
        });

        // 6. Validate user
        user.validate();

        // 7. Save to database
        await this.cosmosDbRepository.create(user.toJSON());

        // 8. Generate Token
        // Generate token with user ID and Role
        const token = this.tokenService.generate({
            id: user.id,
            role: user.role
        });

        // Return user without password
        const { password: _, ...userWithoutPassword } = user.toJSON();

        return {
            success: true,
            data: userWithoutPassword,
            token: token
        };
    }
}

module.exports = RegisterUser;
