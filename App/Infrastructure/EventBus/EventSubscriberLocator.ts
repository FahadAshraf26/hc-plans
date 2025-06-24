import fileSystem from 'fs';
import path from 'path';

const { join: joinPaths } = path;
const fs = fileSystem.promises;

class EventSubscriberLocator {
  static async walk(dir) {
    let files: any = await fs.readdir(dir);
    files = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(dir, file);
        const stats = await fs.stat(filePath);
        if (stats.isDirectory()) return this.walk(filePath);
        else if (stats.isFile()) return filePath;
      }),
    );

    return files.reduce((all, folderContents) => all.concat(folderContents), []);
  }

  static async getSubscribers() {
    const useCaseBasePath = joinPaths(__dirname, '..', '..', '..', 'App', 'Application');
    const paths = (await this.walk(useCaseBasePath)).filter((path) =>
      path.includes('EventSubscriber.js'),
    );
    return paths.map((path) => require(path));
  }
}

export default EventSubscriberLocator;
