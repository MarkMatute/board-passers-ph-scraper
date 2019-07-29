import IPasser from "./IPasser";

export default interface IJsonOutput {
    exam: string;
    year: number;
    month?: number;
    passers: IPasser[];
}