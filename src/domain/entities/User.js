class User {
    constructor({ id, name, email, password, profileImageUrl, role, createdAt,
        age, gender, height, currentWeight, weightHistory, activityLevel, goal, streak, dailyCalories }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.profileImageUrl = profileImageUrl || null;
        this.role = role || 'user';
        this.createdAt = createdAt || new Date().toISOString();

        // Profile fields
        this.age = age || null;
        this.gender = gender || null; // 'male', 'female'
        this.height = height || null; // cm
        this.currentWeight = currentWeight || null; // kg
        this.weightHistory = weightHistory || []; // [{ date, weight }]
        this.activityLevel = activityLevel || null; // 'sedentary', 'active', etc
        this.goal = goal || null; // 'lose_weight', 'muscle', 'maintenance'
        this.streak = streak || 0;
        this.streak = streak || 0;
        this.dailyCalories = dailyCalories || 2000; // Default
        this.macrosGoal = {
            proteins: 0,
            carbs: 0,
            fats: 0
        };
        // If passed individually or in macros object
        if (arguments[0].macrosGoal) {
            this.macrosGoal = arguments[0].macrosGoal;
        }
    }

    validate() {
        if (!this.email || !this.email.includes('@')) {
            throw new Error('Valid email is required');
        }
        if (!this.name || this.name.trim() === '') {
            throw new Error('Name is required');
        }
        if (!this.password || this.password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }
        return true;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            password: this.password,
            profileImageUrl: this.profileImageUrl,
            role: this.role,
            createdAt: this.createdAt,
            age: this.age,
            gender: this.gender,
            height: this.height,
            currentWeight: this.currentWeight,
            weightHistory: this.weightHistory,
            activityLevel: this.activityLevel,
            goal: this.goal,
            streak: this.streak,
            streak: this.streak,
            dailyCalories: this.dailyCalories,
            macrosGoal: this.macrosGoal
        };
    }
}

module.exports = User;
