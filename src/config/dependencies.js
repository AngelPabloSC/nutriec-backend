const CosmosDbRepository = require('../infrastructure/repositories/CosmosDbRepository');
const BlobStorageRepository = require('../infrastructure/repositories/BlobStorageRepository');

const CreateFoodRecord = require('../application/use-cases/food-records/CreateFoodRecord');
const GetFoodRecords = require('../application/use-cases/food-records/GetFoodRecords');
const GetDailySummary = require('../application/use-cases/food-records/GetDailySummary');
const GetFoodHistory = require('../application/use-cases/food-records/GetFoodHistory');
const GetDetailedStatistics = require('../application/use-cases/statistics/GetDetailedStatistics');
const UploadFoodImage = require('../application/use-cases/images/UploadFoodImage');
const AnalyzeFood = require('../application/use-cases/images/AnalyzeFood');
const RegisterUser = require('../application/use-cases/auth/RegisterUser');
const LoginUser = require('../application/use-cases/auth/LoginUser');
const GetUserProfile = require('../application/use-cases/user/GetUserProfile');
const UpdateUserProfile = require('../application/use-cases/user/UpdateUserProfile');

const FoodRecordController = require('../presentation/controllers/FoodRecordController');
const ImageController = require('../presentation/controllers/ImageController');
const AuthController = require('../presentation/controllers/AuthController');
const UserController = require('../presentation/controllers/UserController');

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
const getDailySummaryUseCase = new GetDailySummary(cosmosDbRepository);
const getFoodHistoryUseCase = new GetFoodHistory(cosmosDbRepository);
const getDetailedStatisticsUseCase = new GetDetailedStatistics(cosmosDbRepository);
const uploadFoodImageUseCase = new UploadFoodImage(blobStorageRepository, cosmosDbRepository);
const analyzeFoodUseCase = new AnalyzeFood();
const registerUserUseCase = new RegisterUser(cosmosDbRepository, blobStorageRepository, encryptionService, tokenService);
const loginUserUseCase = new LoginUser(cosmosDbRepository, encryptionService, tokenService);
const getUserProfileUseCase = new GetUserProfile(cosmosDbRepository);
const updateUserProfileUseCase = new UpdateUserProfile(cosmosDbRepository, blobStorageRepository);

// Initialize Controllers
const foodRecordController = new FoodRecordController(
    createFoodRecordUseCase,
    getFoodRecordsUseCase,
    getDailySummaryUseCase,
    uploadFoodImageUseCase,
    getFoodHistoryUseCase,
    getDetailedStatisticsUseCase
);
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
    getFoodHistoryUseCase,
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
