const { beautifyJson, beautifyNode } = require("../core/utils");
const driver = require("../db");

const LocationService = {
	async listLocations() {
		const session = driver.session();

		try {
			const result = await session.run(
				"MATCH (l:Location)-[:LOCATED_AT]->(b:Building) RETURN l, b"
			);

			return result.records.map((record) => {
				const locationNode = record.get("l");
				const buildingNode = record.get("b");

				// Create a new object structure combining both Location and Building properties
				return {
					...beautifyJson({
						keys: record.keys,
						_fields: [locationNode],
						_fieldLookup: { l: 0 }, // assuming 'l' is the key used in the RETURN clause of your Cypher query
					}),
					building: beautifyJson({
						keys: record.keys,
						_fields: [buildingNode],
						_fieldLookup: { b: 1 }, // assuming 'b' is the key used in the RETURN clause of your Cypher query
					}),
				};
			});
		} catch (error) {
			throw error;
		} finally {
			await session.close();
		}
	},

	async getLocationByBuildingId(buildingId) {
		const session = driver.session();

		try {
			const result = await session.run(
				"MATCH (l:Location)-[:LOCATED_AT]->(b:Building) WHERE b.buildingId = $buildingId OPTIONAL MATCH (l)-[:CONNECTED_TO]->(l2:Location) RETURN l, b, l2",
				{
					buildingId: buildingId,
				}
			);

			return result.records.map((record) => {
				const locationNode = record.get("l");
				const buildingNode = record.get("b");
				const connectedLocationNode = record.get("l2");

				return {
					...beautifyJson({
						keys: record.keys,
						_fields: [locationNode],
						_fieldLookup: { l: 0 },
					}),
					building: beautifyJson({
						keys: record.keys,
						_fields: [buildingNode],
						_fieldLookup: { b: 1 },
					}),
					// return null if there are no connected locations or array of connected locations
					connectedLocations: connectedLocationNode
						? beautifyJson({
								keys: record.keys,
								_fields: [connectedLocationNode],
								_fieldLookup: { l2: 2 },
						  })
						: null,
				};
			});
		} catch (error) {
			throw error;
		} finally {
			await session.close();
		}
	},

	async getLocationById(locationId) {
		const session = driver.session();

		try {
			// Also include connected locations as an array
			const result = await session.run(
				"MATCH (l:Location)-[:LOCATED_AT]->(b:Building) WHERE l.locationId = $locationId OPTIONAL MATCH (l)-[:CONNECTED_TO]->(l2:Location) RETURN l, b, l2",
				{
					locationId: locationId,
				}
			);

			const locationNode = result.records[0].get("l");
			const buildingNode = result.records[0].get("b");
			const connectedLocationNode = result.records[0].get("l2");

			return {
				...beautifyJson({
					keys: result.records[0].keys,
					_fields: [locationNode],
					_fieldLookup: { l: 0 },
				}),
				building: beautifyJson({
					keys: result.records[0].keys,
					_fields: [buildingNode],
					_fieldLookup: { b: 1 },
				}),
				connectedLocations: connectedLocationNode
					? beautifyJson({
							keys: result.records[0].keys,
							_fields: [connectedLocationNode],
							_fieldLookup: { l2: 2 },
					  })
					: null,
			};
		} catch (error) {
			throw error;
		} finally {
			await session.close();
		}
	},

	async createLocation(locationData) {
		const session = driver.session();

		try {
			if (!locationData.buildingId) {
				throw new Error("BuildingId is required");
			}

			// Create the location node first
			const createResult = await session.run(
				"CREATE (l:Location {locationId: randomUUID(), buildingId: $buildingId, name: $name, description: $description, floor: $floor, roomNumber: $roomNumber}) RETURN l",
				{
					buildingId: locationData.buildingId,
					name: locationData.name,
					description: locationData.description,
					floor: locationData.floor,
					roomNumber: locationData.roomNumber,
				}
			);

			const locationNode = createResult.records[0].get("l");

			// Now, update the LOCATED_AT relationship
			await createOrUpdateLocatedAtRelationship(
				session,
				locationNode.properties.locationId,
				locationData.buildingId
			);

			// Process connected locations
			if (
				locationData.connectedLocations &&
				locationData.connectedLocations.length > 0
			) {
				await processConnectedLocations(
					session,
					locationNode.properties.locationId,
					locationData.connectedLocations
				);
			}

			return beautifyJson(locationNode);
		} catch (error) {
			throw error;
		} finally {
			await session.close();
		}
	},

	async updateLocation(locationId, locationData) {
		const session = driver.session();

		try {
			// Update the location node properties
			const updateResult = await session.run(
				`MATCH (l:Location) WHERE l.locationId = $locationId
				 SET l.name = $name, l.description = $description, l.floor = $floor, l.roomNumber = $roomNumber
				 RETURN l`,
				{
					locationId: locationId,
					name: locationData.name,
					description: locationData.description,
					floor: locationData.floor,
					roomNumber: locationData.roomNumber,
				}
			);

			const locationNode = updateResult.records[0].get("l");

			// Update the LOCATED_AT relationship if the buildingId has changed
			if (locationData.buildingId) {
				await createOrUpdateLocatedAtRelationship(
					session,
					locationId,
					locationData.buildingId
				);
			}

			// Update connected locations
			if (locationData.connectedLocations) {
				await updateConnectedLocations(
					session,
					locationId,
					locationData.connectedLocations
				);
			}

			console.log("Updated location:", locationNode);
			return beautifyNode(locationNode);
		} catch (error) {
			console.error("Failed to update location:", error);
			throw error;
		} finally {
			await session.close();
		}
	},

	async getDistanceAndPathBetweenLocations(locationIdStart, locationIdEnd) {
		const session = driver.session();

		try {
			return await getDistanceAndPathBetweenLocations(
				session,
				locationIdStart,
				locationIdEnd
			);
		} catch (error) {
			throw error;
		} finally {
			await session.close();
		}
	},

	async deleteLocation(locationId) {
		const session = driver.session();

		try {
			const result = await session.run(
				"MATCH (l:Location) WHERE l.locationId = $locationId DETACH DELETE l",
				{
					locationId: locationId,
				}
			);
			return beautifyJson(result.records[0]);
		} catch (error) {
			throw error;
		} finally {
			await session.close();
		}
	},

	
};

async function getDistanceAndPathBetweenLocations(session, locationIdStart, locationIdEnd) {
    try {
        const result = await session.run(
            `MATCH (start:Location {locationId: $locationIdStart}), (end:Location {locationId: $locationIdEnd}),
             path = shortestPath((start)-[:CONNECTED_TO*..15]-(end))
             RETURN nodes(path) AS nodePath, relationships(path) AS relsPath, 
             reduce(distance = 0, r in relationships(path) | distance + coalesce(r.distance, 0)) AS totalDistance`,
            {
                locationIdStart: locationIdStart,
                locationIdEnd: locationIdEnd
            }
        );

        if (result.records.length === 0) {
            return { path: [], distances: [], totalDistance: 0 }; // No path found
        }

        const nodes = result.records[0].get('nodePath').map(node => node.properties);
        const rels = result.records[0].get('relsPath').map(rel => rel.properties.distance);

        let pathWithDistances = nodes.map((node, index) => {
            let distanceToNext = index < rels.length ? rels[index] : 0;
            return { ...node, distanceToNext };
        });

        const totalDistance = result.records[0].get('totalDistance');

        return {
            path: pathWithDistances,
            totalDistance: totalDistance
        };
    } catch (error) {
        console.error('Error getting distance and path between locations:', error);
        throw error;
    }
}


async function processConnectedLocations(
	session,
	locationId,
	connectedLocationIds
) {
	const validConnectedLocationIds = connectedLocationIds.filter(
		(id) => id !== locationId
	);

	for (const connectedLocationId of validConnectedLocationIds) {

		// Distance is currently hardcoded to 100 meters
		const distance = 100;

		await session.run(
			`MATCH (l:Location {locationId: $locationId}), (l2:Location {locationId: $connectedLocationId}) 
			MERGE (l)-[r:CONNECTED_TO]->(l2)
			ON CREATE SET r.distance = $distance
			ON MATCH SET r.distance = $distance
			MERGE (l2)-[r2:CONNECTED_TO]->(l)
			ON CREATE SET r2.distance = $distance
			ON MATCH SET r2.distance = $distance`,
			{
				locationId: locationId,
				connectedLocationId: connectedLocationId,
				distance: distance
			}
		);

		await session.run(
			`MATCH (l:Location {locationId: $locationId}), (l2:Location {locationId: $connectedLocationId})
			MERGE (l)-[r:CONNECTED_TO]->(l2)`,
			{
				locationId: locationId,
				connectedLocationId: connectedLocationId
			}
		);
	}
	
}

async function updateConnectedLocations(
	session,
	locationId,
	newConnectedLocationIds
) {
	await session.run(
		`MATCH (l:Location {locationId: $locationId})-[r:CONNECTED_TO]->(l2:Location)
         WHERE NOT l2.locationId IN $newConnectedLocationIds
         DELETE r`,
		{
			locationId: locationId,
			newConnectedLocationIds: newConnectedLocationIds,
		}
	);

	for (const connectedLocationId of newConnectedLocationIds) {

		console.log('connectedLocationId:', connectedLocationId);

		if (locationId !== connectedLocationId) {
			await session.run(
				`	
				MERGE (l:Location {locationId: $locationId})
				MERGE (l2:Location {locationId: $connectedLocationId})
				MERGE (l)-[r:CONNECTED_TO]->(l2)
				MERGE (l2)-[r2:CONNECTED_TO]->(l)
				ON CREATE SET r.distance = $distance, r2.distance = $distance
				ON MATCH SET r.distance = $distance, r2.distance = $distance`,
				{
					locationId: locationId,
					connectedLocationId: connectedLocationId,
					distance: 100
				}
			);
		}
	}
}

async function createOrUpdateLocatedAtRelationship(
	session,
	locationId,
	buildingId
) {
	await session.run(
		`MATCH (l:Location {locationId: $locationId})
		OPTIONAL MATCH (l)-[r:LOCATED_AT]->(oldBuilding)
		DELETE r
		WITH l
		MATCH (newBuilding:Building {buildingId: $buildingId})
		MERGE (l)-[:LOCATED_AT]->(newBuilding)`,
		{
			locationId: locationId,
			buildingId: buildingId,
		}
	);
}

module.exports = LocationService;
