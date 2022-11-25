import { DeviceSecurityModel } from "../security/infrastructure/entity/deviceSecurity.model";

export const activeSessionsViewModel = (device: DeviceSecurityModel) => {
  return {
    deviceId: device.userDevice.deviceId,
    title: device.userDevice.deviceTitle,
    ip: device.userDevice.ipAddress,
    lastActiveDate: new Date(Number(device.userDevice.iat)).toISOString()
  }
}