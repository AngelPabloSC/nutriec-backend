class FoodRecordModel {
    constructor(data) {
        this.id = data.id;
        this.userId = data.userId;
        this.foodName = data.foodName;
        this.calories = data.calories;
        this.macros = {
            proteins: (data.macros && data.macros.proteins) || data.proteins || 0,
            carbs: (data.macros && data.macros.carbs) || data.carbs || 0,
            fats: (data.macros && data.macros.fats) || data.fats || 0
        };
        this.imageUrl = data.imageUrl;
        this.category = data.category; // 'Almuerzo', etc
        this.tags = data.tags || []; // ['Pescado']
        this.time = data.time; // '12:00'
        this.date = data.date;
        this.createdAt = data.createdAt;
        this.type = 'foodRecord'; // Discriminator
    }

    static toDomain(model) {
        return {
            id: model.id,
            userId: model.userId,
            foodName: model.foodName,
            calories: model.calories,
            proteins: model.macros.proteins,
            carbs: model.macros.carbs,
            fats: model.macros.fats,
            imageUrl: model.imageUrl,
            date: model.date,
            createdAt: model.createdAt,
            // Metadata
            category: model.category,
            tags: model.tags,
            time: model.time
        };
    }

    static fromDomain(entity) {
        return new FoodRecordModel({
            id: entity.id,
            userId: entity.userId,
            foodName: entity.foodName,
            calories: entity.calories,
            proteins: entity.proteins,
            carbs: entity.carbs,
            fats: entity.fats,
            imageUrl: entity.imageUrl,
            date: entity.date,
            createdAt: entity.createdAt,
            // Metadata
            category: entity.category,
            tags: entity.tags,
            time: entity.time
        });
    }
}

module.exports = FoodRecordModel;
