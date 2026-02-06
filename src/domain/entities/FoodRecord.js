class FoodRecord {
    constructor({ id, userId, foodName, calories, proteins, carbs, fats, imageUrl, date, createdAt, category, tags, time }) {
        this.id = id;
        this.userId = userId;
        this.foodName = foodName;
        this.calories = calories;
        this.proteins = proteins || 0;
        this.carbs = carbs || 0;
        this.fats = fats || 0;
        this.imageUrl = imageUrl || null;
        this.date = date || new Date().toISOString();
        this.createdAt = createdAt || new Date().toISOString();

        // Metadata
        this.category = category || 'Snack';
        this.tags = tags || [];
        this.time = time || '00:00';
    }

    validate() {
        if (!this.userId) {
            throw new Error('User ID is required');
        }
        if (!this.foodName || this.foodName.trim() === '') {
            throw new Error('Food name is required');
        }
        if (this.calories < 0) {
            throw new Error('Calories must be a positive number');
        }
        return true;
    }

    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            foodName: this.foodName,
            calories: this.calories,
            proteins: this.proteins,
            carbs: this.carbs,
            fats: this.fats,
            imageUrl: this.imageUrl,
            date: this.date,
            createdAt: this.createdAt,
            // Metadata
            category: this.category,
            tags: this.tags,
            time: this.time
        };
    }
}

module.exports = FoodRecord;
