export class UserIpAddressModel {
  constructor(
    public ipAddress: string,
    public endpoint: string,
    public connectionAt: number,
  ) {}
}
