export default class QuickSlot {
  constructor(
    public psychologist: string,
    public date: Date,
    public startTime: Date, 
    public endTime: Date, 
    public durationInMins: number, // slot duration
    public bufferTimeInMins: number, // optional buffer
    public status: "active" | "inactive" = "active",
    public id?: string
  ) {}
}
