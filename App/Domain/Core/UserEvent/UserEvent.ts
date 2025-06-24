import uuid from 'uuid/v4';

class UserEvent {
    private userEventId: string;
    private userId: string;
    type: string;
    private parentId: string;
    parentEvent: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;

    constructor(userEventId: string, userId: string, type: string, parentId: string) {
        this.userEventId = userEventId;
        this.userId = userId;
        this.type = type;
        this.parentId = parentId;
    }

    setParentEvent(parentEvent: string) {
        this.parentEvent = parentEvent;
    }

    /**
     * Set Created Date
     * @param {Date} createdAt
     */
    setCreatedAt(createdAt: Date) {
        this.createdAt = createdAt;
    }

    /**
     * Set Updated Date
     * @param {Date} updatedAt
     */
    setUpdatedAt(updatedAt: Date) {
        this.updatedAt = updatedAt;
    }

    /**
     * Set Deleted Date
     * @param {Date} deletedAt
     */
    setDeletedAT(deletedAt: Date) {
        this.deletedAt = deletedAt;
    }

    /**
     * Create UserEvent Object
     * @param {object} userEventObj
     * @returns UserEvent
     */
    static createFromObject(userEventObj) {
        const userEvent = new UserEvent(
            userEventObj.userEventId,
            userEventObj.userId,
            userEventObj.type,
            userEventObj.parentId,
        );

        if (userEventObj.parentEvent) {
            userEvent.setParentEvent(userEventObj.parentEvent);
        }

        if (userEventObj.createdAt) {
            userEvent.setCreatedAt(userEventObj.createdAt);
        }

        if (userEventObj.updatedAt) {
            userEvent.setUpdatedAt(userEventObj.updatedAt);
        }

        if (userEventObj.deletedAt) {
            userEvent.setDeletedAT(userEventObj.deletedAt);
        }

        return userEvent;
    }

    /**
     * Create UserEvent Object with Id
     * @param {string} userId
     * @param {string} type
     * @param {string} parentId
     * @returns UserEvent
     */
    static createFromDetail(userId: string, type: string, parentId?: string) {
        return new UserEvent(uuid(), userId, type, parentId);
    }
}

export default UserEvent;
