export default class SpecialDay {
  constructor(
    public psychologist: string,
    public date: Date,
    public type: "override" | "absent", //override-different schedule,absent-complete holiday
    public startTime?: Date,                    //not needed for absent
    public endTime?: Date,                     //not needed for absent
    public durationInMins?: number, // slot duration  //not needed for absent
    public bufferTimeInMins?: number, // optional buffer
    public status: "active" | "inactive" = "active",
    public id?: string
  ) {}
}
