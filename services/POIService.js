const driver = require('../db');

const POIService = {
    async listPOIs() {
        const session = driver.session();

        try {
            const result = await session.run("MATCH (poi:PointOfInterest) RETURN poi");
            return result.records;
        } catch (error) {
            throw error;
        } finally {
            await session.close();
        }
    },

    async getPOIById(poiId) {
        const session = driver.session();

        try {
            const result = await session.run(
                "MATCH (poi:PointOfInterest) WHERE id(poi) = $poiId RETURN poi",
                {
                    poiId: poiId,
                }
            );
            return result.records;
        } catch (error) {
            throw error;
        } finally {
            await session.close();
        }

    },

    async createPOI(poiData) {
        const session = driver.session();

        try {
            const result = await session.run(
                "CREATE (poi:PointOfInterest {poiId: randomUUID(), name: $name, description: $description, category: $category}) RETURN poi",
                {
                    name: poiData.name,
                    description: poiData.description,
                    category: poiData.category
                }
            );

            const poiNode = result.records[0].get("poi");

            await session.run(
                "MATCH (poi:PointOfInterest {poiId: $poiId}), (l:Location {locationId: $locationId}) CREATE (poi)-[:LOCATED_AT]->(l)",
                {
                    poiId: poiNode.properties.poiId,
                    locationId: poiData.locationId,
                }
            );

            return poiNode;
        } catch (error) {
            throw error;
        } finally {
            await session.close();
        }
    },

    async updatePOI(poiId, poiData) {
        const session = driver.session();

        try {
            const result = await session.run(
                "MATCH (poi:PointOfInterest) WHERE id(poi) = $poiId SET poi.name = $name, poi.description = $description, poi.location = $location, poi.category = $category RETURN poi",
                {
                    poiId: poiId,
                    name: poiData.name,
                    description: poiData.description,
                    location: poiData.location,
                    category: poiData.category
                }
            );

            const poiNode = result.records[0].get("poi");

            await session.run(
                "MATCH (poi:PointOfInterest {poiId: $poiId})-[r:LOCATED_AT]->() DELETE r",
                {
                    poiId: poiNode.properties.poiId,
                }
            );

            await session.run(
                "MATCH (poi:PointOfInterest {poiId: $poiId}), (l:Location {locationId: $locationId}) CREATE (poi)-[:LOCATED_AT]->(l)",
                {
                    poiId: poiNode.properties.poiId,
                    locationId: poiData.locationId,
                }
            );

            return result.records;
        } catch (error) {
            throw error;
        } finally {
            await session.close();
        }
    },

    async deletePOI(poiId) {
        const session = driver.session();

        try {
            const result = await session.run(
                "MATCH (poi:PointOfInterest) WHERE id(poi) = $poiId DETACH DELETE poi",
                {
                    poiId: poiId
                }
            );
            return result.records;
        } catch (error) {
            throw error;
        } finally {
            await session.close();
        }
    }
};

module.exports = POIService;
