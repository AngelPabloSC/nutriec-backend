class GetFoodRecords {
    constructor(cosmosDbRepository) {
        this.repository = cosmosDbRepository;
    }

    async execute(userId, filters = {}) {
        try {
            let result;

            // If date range is provided, use it
            if (filters.startDate && filters.endDate) {
                result = await this.repository.findFoodRecordsByDateRange(
                    userId,
                    filters.startDate,
                    filters.endDate
                );
            } else {
                // Otherwise get all records for user
                result = await this.repository.findFoodRecordsByUserId(userId);
            }

            return {
                success: true,
                data: result.data,
                count: result.count
            };
        } catch (error) {
            console.error('Error in GetFoodRecords use case:', error);
            throw error;
        }
    }
}

module.exports = GetFoodRecords;
