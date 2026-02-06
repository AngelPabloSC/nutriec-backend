class UserModel {
    constructor(data) {
        this.id = data.id;
        this.partitionKey = data.partitionKey || data.id; // Usually same for Users
        this.type = 'user';
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.profileImageUrl = data.profileImageUrl;
        this.role = data.role;
        this.createdAt = data.createdAt;

        // Profile
        this.age = data.age;
        this.gender = data.gender;
        this.height = data.height;
        this.currentWeight = data.currentWeight;
        this.weightHistory = data.weightHistory || [];
        this.activityLevel = data.activityLevel;
        this.goal = data.goal;
        this.streak = data.streak;
        this.streak = data.streak;
        this.dailyCalories = data.dailyCalories;
        this.macrosGoal = data.macrosGoal || { proteins: 0, carbs: 0, fats: 0 };
    }

    static toDomain(userModel) {
        return {
            id: userModel.id,
            name: userModel.name,
            email: userModel.email,
            password: userModel.password,
            profileImageUrl: userModel.profileImageUrl,
            role: userModel.role,
            createdAt: userModel.createdAt,

            // Profile
            age: userModel.age,
            gender: userModel.gender,
            height: userModel.height,
            currentWeight: userModel.currentWeight,
            weightHistory: userModel.weightHistory,
            activityLevel: userModel.activityLevel,
            goal: userModel.goal,
            streak: userModel.streak,
            streak: userModel.streak,
            dailyCalories: userModel.dailyCalories,
            macrosGoal: userModel.macrosGoal
        };
    }

    static fromDomain(userDomain) {
        return new UserModel({
            id: userDomain.id,
            partitionKey: userDomain.id, // Assuming ID is PK
            name: userDomain.name,
            email: userDomain.email,
            password: userDomain.password,
            profileImageUrl: userDomain.profileImageUrl,
            role: userDomain.role,
            createdAt: userDomain.createdAt,

            age: userDomain.age,
            gender: userDomain.gender,
            height: userDomain.height,
            currentWeight: userDomain.currentWeight,
            weightHistory: userDomain.weightHistory,
            activityLevel: userDomain.activityLevel,
            goal: userDomain.goal,
            streak: userDomain.streak,
            streak: userDomain.streak,
            dailyCalories: userDomain.dailyCalories,
            macrosGoal: userDomain.macrosGoal
        });
    }
}

module.exports = UserModel;
