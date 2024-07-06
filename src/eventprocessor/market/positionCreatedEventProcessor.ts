import { EventProcessor } from '../eventProcessor';
import { PositionCreatedEvent } from '../../events/positionCreatedEvent';
import { Logger } from '../../utils/logger';
import { Database } from '../../database/database';

export class PositionCreatedEventProcessor implements EventProcessor {
    private logger: Logger;
    private database: Database;

    constructor(logger: Logger, database: Database) {
        this.logger = logger;
        this.database = database;
    }

    async process(event: PositionCreatedEvent): Promise<void> {
        this.logger.debug('Processing PositionCreatedEvent', event);

        try {
            const parsedEvent = this.parseEvent(event);
            this.logger.debug('Parsed event', parsedEvent);

            await this.saveEvent(parsedEvent);
            this.logger.info('PositionCreatedEvent successfully processed and saved', parsedEvent);
        } catch (error) {
            this.logger.error('Error processing PositionCreatedEvent', error);
            throw error;
        }
    }

    private parseEvent(event: PositionCreatedEvent): any {
        // Assuming the event has a specific structure that needs to be parsed
        this.logger.debug('Parsing event', event);
        const parsedEvent = {
            id: event.id,
            positionId: event.positionId,
            marketId: event.marketId,
            timestamp: event.timestamp,
            details: event.details
        };
        this.logger.debug('Event parsed successfully', parsedEvent);
        return parsedEvent;
    }

    private async saveEvent(parsedEvent: any): Promise<void> {
        this.logger.debug('Saving event to database', parsedEvent);
        try {
            await this.database.save('PositionCreatedEvents', parsedEvent);
            this.logger.debug('Event saved successfully', parsedEvent);
        } catch (error) {
            this.logger.error('Error saving event to database', error);
            throw error;
        }
    }
}