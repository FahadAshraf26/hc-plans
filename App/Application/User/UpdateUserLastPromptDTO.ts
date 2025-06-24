class UpdateUserLastPromptDTO {
    private readonly userId: string;
    private readonly lastPrompt: Date;

    constructor(userId: string, lastPrompt: Date) {
        this.userId = userId;
        this.lastPrompt = lastPrompt
    }


    getUserId() {
        return this.userId;
    }

    getlastPrompt() {
        return this.lastPrompt;
    }
}

export default UpdateUserLastPromptDTO;