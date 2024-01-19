import {
  DocumentDirectoryPath,
  exists,
  mkdir,
  readFile,
  stat,
  unlink,
  writeFile,
  readDir,
  ReadDirItem,
} from 'react-native-fs';

interface CacheData {
  data?: any;
  count?: number;
}

interface Cache {
  [key: string]: CacheData;
}

import * as RNZipArchive from 'react-native-zip-archive';
class FileStorage {
  cache: Cache = {};

  async readFile(path: string) {
    return await readFile(path, 'utf8');
  }

  async writeFile(path: string, data: string) {
    return await writeFile(path, data, 'utf8');
  }

  async createDirectory(path: string) {
    return await mkdir(path);
  }

  async exists(path: string) {
    return await exists(path);
  }

  async removeItem(path: string) {
    return await unlink(path);
  }

  async getInfo(path: string) {
    return await stat(path);
  }
}

export default new FileStorage();

/**
 * iOS: /var/mobile/Containers/Data/Application/196A05AD-6B11-403D-BA2D-6DC1F30075E1/Documents/inji/VC/<filename>
 * android: /data/user/0/io.mosip.residentapp/files/inji/VC/<filename>
 * These paths are coming from DocumentDirectoryPath in react-native-fs.
 */
export const getFilePath = (key: string) => {
  return `${vcDirectoryPath}/${key}.txt`;
};

export const getBackupFilePath = (key: string) => {
  return `${backupDirectoryPath}/${key}.injibackup`;
};

export const vcDirectoryPath = `${DocumentDirectoryPath}/inji/VC`;
export const backupDirectoryPath = `${DocumentDirectoryPath}/inji/backup`;
export const zipFilePath = (filename: string) =>
  `${DocumentDirectoryPath}/inji/backup/${filename}.zip`;

export async function compressAndRemoveFile(fileName: string): Promise<string> {
  const result = await compressFile(fileName);
  await removeFile(fileName);
  return result;
}
async function compressFile(fileName: string): Promise<string> {
  return await RNZipArchive.zip(backupDirectoryPath, zipFilePath(fileName));
}

async function removeFile(fileName: string) {
  await new FileStorage().removeItem(getBackupFilePath(fileName));
}
