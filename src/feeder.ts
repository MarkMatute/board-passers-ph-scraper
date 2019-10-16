import fs from 'fs';
import axios from 'axios';

class Feeder {

  apiUrl: string = 'http::/localhost'

  public startFeed = async () => {
    const outputs = await this.getJsonFiles();
     await this.sendToServer(outputs);
  }

  private getJsonFiles = async () => {
    return new Promise((resolve, reject) => {
      fs.readdir('./outputs', (err, files) => {
        const output: any[] = [];
        files.forEach((file) => {
          fs.readFile(`./outputs/${file}`, (err, data) => {
            if (err) throw err;
            try {
              let parsedData = JSON.parse(data.toString());
              output.push(parsedData);
            } catch (error) {
              console.log(`${file} failed.`);
            }
          });
        });
        resolve(output);
      });
    });
  }

  private sendToServer = async (outputs: any) => {

  }

  private saveExam = async () => {

  }

  private savePassers = async () => {
    
  }

}

(async () => {
  await new Feeder().startFeed();
})();