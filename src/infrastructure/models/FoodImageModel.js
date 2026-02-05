class FoodImageModel {
    constructor(data) {
        this.id = data.id;
        this.userId = data.userId;
        this.imageUrl = data.imageUrl;
        this.blobName = data.blobName;
        this.analysis = data.analysis; // JSON object with prediction results
        this.createdAt = data.createdAt;
        this.type = 'foodImage';
    }

    static toDomain(model) {
        return {
            id: model.id,
            userId: model.userId,
            imageUrl: model.imageUrl,
            blobName: model.blobName,
            analysis: model.analysis,
            createdAt: model.createdAt
        };
    }

    static fromDomain(entity) {
        return new FoodImageModel({
            id: entity.id,
            userId: entity.userId,
            imageUrl: entity.imageUrl,
            blobName: entity.blobName,
            analysis: entity.analysis,
            createdAt: entity.createdAt
        });
    }
}

module.exports = FoodImageModel;
