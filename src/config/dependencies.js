const CosmosDbRepository = require('../infrastructure/repositories/CosmosDbRepository');
const BlobStorageRepository = require('../infrastructure/repositories/BlobStorageRepository');

const CreateFoodRecord = require('../use-cases/food-records/CreateFoodRecord');
const GetFoodRecords = require('../use-cases/food-records/GetFoodRecords');
const UploadFoodImage = require('../use-cases/images/UploadFoodImage');
const AnalyzeFood = require('../use-cases/images/AnalyzeFood');
const RegisterUser = require('../use-cases/auth/RegisterUser');
const LoginUser = require('../use-cases/auth/LoginUser');
const GetUserProfile = require('../use-cases/user/GetUserProfile');
const UpdateUserProfile = require('../use-cases/user/UpdateUserProfile');

const FoodRecordController = require('../controllers/FoodRecordController');
const ImageController = require('../controllers/ImageController');
const AuthController = require('../controllers/AuthController');
const UserController = require('../controllers/UserController');

// Services
const encryptionService = require('../infrastructure/services/EncryptionService');
const TokenService = require('../infrastructure/services/TokenService');

// Initialize Repositories
const cosmosDbRepository = new CosmosDbRepository();
const blobStorageRepository = new BlobStorageRepository();

// Initialize Services
// encryptionService is already initialized (singleton)
const tokenService = new TokenService();

// Initialize Use Cases
const createFoodRecordUseCase = new CreateFoodRecord(cosmosDbRepository);
const getFoodRecordsUseCase = new GetFoodRecords(cosmosDbRepository);
const uploadFoodImageUseCase = new UploadFoodImage(blobStorageRepository, cosmosDbRepository);
const analyzeFoodUseCase = new AnalyzeFood();
const registerUserUseCase = new RegisterUser(cosmosDbRepository, blobStorageRepository, encryptionService, tokenService);
const loginUserUseCase = new LoginUser(cosmosDbRepository, encryptionService, tokenService);
const getUserProfileUseCase = new GetUserProfile(cosmosDbRepository);
const updateUserProfileUseCase = new UpdateUserProfile(cosmosDbRepository);

// Initialize Controllers
const foodRecordController = new FoodRecordController(createFoodRecordUseCase, getFoodRecordsUseCase);
const imageController = new ImageController(uploadFoodImageUseCase, analyzeFoodUseCase);
const authController = new AuthController(registerUserUseCase, loginUserUseCase);
const userController = new UserController(getUserProfileUseCase, updateUserProfileUseCase);

module.exports = {
    // Repositories
    cosmosDbRepository,
    blobStorageRepository,

    // Use Cases
    createFoodRecordUseCase,
    getFoodRecordsUseCase,
    uploadFoodImageUseCase,
    analyzeFoodUseCase,
    registerUserUseCase,
    loginUserUseCase,
    getUserProfileUseCase,
    updateUserProfileUseCase,

    // Controllers
    foodRecordController,
    imageController,
    authController,
    userController
};
