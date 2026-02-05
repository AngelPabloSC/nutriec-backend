class FoodRecordModel {
    constructor(data) {
        this.id = data.id;
        this.userId = data.userId;
        this.foodName = data.foodName;
        this.calories = data.calories;
        this.macros = {
            proteins: data.proteins || 0,
            carbs: data.carbs || 0,
            fats: data.fats || 0
        };
        this.imageUrl = data.imageUrl;
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
            createdAt: model.createdAt
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
            createdAt: entity.createdAt
        });
    }
}

module.exports = FoodRecordModel;
