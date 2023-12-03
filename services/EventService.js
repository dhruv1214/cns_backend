const driver = require('../db');
const {beautifyJson} = require("../core/utils");


const EventService = {
    async listEvents() {
        const session = driver.session();

        try {

            const result = await session.run(
                "MATCH (e:Event)-[:LOCATED_AT]->(l:Location) RETURN e, l"
            );

            return result.records.map((record) => {
                const eventNode = record.get("e");
                const locationNode = record.get("l");

                return {
                    ...beautifyJson({
                        keys: record.keys,
                        _fields: [eventNode],
                        _fieldLookup: { e: 0 },
                    }),
                    location: beautifyJson({
                        keys: record.keys,
                        _fields: [locationNode],
                        _fieldLookup: { l: 1 },
                    }),
                };
            });

        } catch (error) {
            throw error;
        } finally {
            await session.close();
        }

    },

    // 				"MATCH (l:Location)-[:LOCATED_AT]->(b:Building) WHERE l.locationId = $locationId OPTIONAL MATCH (l)-[:CONNECTED_TO]->(l2:Location) RETURN l, b, l2",
    async getEventById(eventId) {
        const session = driver.session();

        try {
            const result = await session.run(
                // "MATCH (e:Event) WHERE e.eventId = $eventId
                "MATCH (e:Event)-[:LOCATED_AT]->(l:Location) WHERE e.eventId = $eventId RETURN e, l",
                {
                    eventId: eventId,
                }
            );



            const eventNode = result.records[0].get("e");
            const locationNode = result.records[0].get("l");

            return {
                ...beautifyJson({
                    keys: result.records[0].keys,
                    _fields: [eventNode],
                    _fieldLookup: { e: 0 },
                }),
                location: beautifyJson({
                    keys: result.records[0].keys,
                    _fields: [locationNode],
                    _fieldLookup: { l: 1 },
                }),
            };

        } catch (error) {
            throw error;
        } finally {
            await session.close();
        }
    },

    async createEvent(eventData) {
        const session = driver.session();

        try {
           
            if(!eventData.locationId){
                throw new Error('LocationId is required');
            }

            const result = await session.run(
                "CREATE (e:Event {eventId: randomUUID(), name: $name, description: $description, startDateTime: $startDateTime, endDateTime: $endDateTime}) RETURN e",
                {
                    name: eventData.name,
                    description: eventData.description,
                    startDateTime: eventData.startDateTime,
                    endDateTime: eventData.endDateTime
                }
            );

            const eventNode = result.records[0].get("e");

            await session.run(
                "MATCH (e:Event {eventId: $eventId}), (l:Location {locationId: $locationId}) CREATE (e)-[:LOCATED_AT]->(l)",
                {
                    eventId: eventNode.properties.eventId,
                    locationId: eventData.locationId
                }
            );

            return eventNode.properties;

        } catch (error) {
            throw error;
        } finally {
            await session.close();
        }
    },

    async updateEvent(eventId, eventData) {
        const session = driver.session();

        try {
            const result = await session.run(
                "MATCH (e:Event) WHERE e.eventId = $eventId SET e.name = $name, e.description = $description, e.startDateTime = $startDateTime, e.endDateTime = $endDateTime RETURN e",
                {
                    eventId: eventId,
                    name: eventData.name,
                    description: eventData.description,
                    startDateTime: eventData.startDateTime,
                    endDateTime: eventData.endDateTime
                }
            );

            const eventNode = result.records[0].get("e");


            await session.run(
                "MATCH (e:Event {eventId: $eventId})-[r:LOCATED_AT]->() DELETE r",
                {
                    eventId: eventNode.properties.eventId
                }
            );

            console.log(eventNode);

            await session.run(
                "MATCH (e:Event {eventId: $eventId}), (l:Location {locationId: $locationId}) CREATE (e)-[:LOCATED_AT]->(l)",
                {
                    eventId: eventNode.properties.eventId,
                    locationId: eventData.locationId
                }
            );

            return eventNode.properties;
        } catch (error) {
            throw error;
        } finally {
            await session.close();
        }
    },

    async deleteEvent(eventId) {
        const session = driver.session();

        try {
            const result = await session.run(
                "MATCH (e:Event) WHERE id(e) = $eventId DETACH DELETE e",
                {
                    eventId: eventId,
                }
            );

            return result.records[0].get("e").properties;
        } catch (error) {
            throw error;
        } finally {
            await session.close();
        }
    }
};

module.exports = EventService;
