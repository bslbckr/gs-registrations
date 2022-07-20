export interface IRegistration {
    readonly id: number;
    readonly team: string;
    readonly city: string;
    readonly strength: number;
    readonly contact: string;
    readonly comment: string;
    readonly confirmed: boolean;
    readonly paid: boolean;
    readonly waitingList: boolean;
    readonly position: number;
    readonly registrationDate: Date;
}
