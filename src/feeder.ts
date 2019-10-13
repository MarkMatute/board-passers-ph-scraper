import fs from 'fs';

class Feeder {

  apiUrl: string = 'http::/localhost'

  public startFeed = async () => {
    const jsonFiles = await this.getJsonFiles();
    console.log(jsonFiles)
  }

  private getJsonFiles = async () => {
   return new Promise((resolve, reject) => {
      fs.readdir('./outputs', (err, files) => {
        const fileNames: string[] = [];
        files.forEach((file) => {
          fileNames.push(file);
        });
        resolve(fileNames);
      });
   });
  }

}

(async () => {
  await new Feeder().startFeed();
})();