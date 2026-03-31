import os from "node:os";
const checkDiskSpace = require("check-disk-space").default; // import the check-disk-space module to check for disk space usage
const osUtils = require("os-utils"); // import the check-disk-space module to check for disk space usage

/**
 * @function _systemMemInfo
 * @exports _getSystemInformation
 * @author ssekabira robert sims
 * @returns {Promise<number | string>} - returns system memory information
 *
 */

const _systemMemInfo = async (): Promise<number | string> => {
  /**
   * @description  get disk space info
   */
  const { free, size, diskPath } = await checkDiskSpace("C:/");
  /**
   * @description convert to GB
   */
  const freeStorageInGB: number = (free / (1024 * 1024 * 1024)).toFixed(
    2
  ) as unknown as number;
  const sizeStorageInGB: number = (size / (1024 * 1024 * 1024)).toFixed(
    2
  ) as unknown as number;
  const usedStorageInGB: number = (sizeStorageInGB - freeStorageInGB).toFixed(
    2
  ) as unknown as number;
  const usedStoragePercentage: number = (
    (usedStorageInGB / sizeStorageInGB) *
    100
  ).toFixed(2) as unknown as number;

  /**
   * @description
   */
  const totalMemory: number = Math.ceil(
    os.totalmem() / (1024 * 1024 * 1024)
  ) as number;

  /**
   *@description  notify user about system cpu usage and alert em how to reduce on the performance of the system cpu usage!!!!!!!!!!
   */
  function getCpuUsage() {
    return new Promise((resolve) => {
      osUtils.cpuUsage((v: number) => {
        const cpuUsagePercentage = (v * 100).toFixed(2); // 2 decimal places
        resolve(cpuUsagePercentage);
      });
    });
  }

  /**
   * @description
   */
  const cpuUsagePercentage = await getCpuUsage();

  /**
   * @description
   */
  return totalMemory;
};

export default _systemMemInfo;
