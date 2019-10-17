import fs from 'fs';
import dotenv from 'dotenv';
import axios from 'axios';

class Feeder {

  apiUrl: string;

  constructor() {
    this.apiUrl = process.env.API;
  }

  /**
   * Start Feed
   */
  public startFeed = async () => {
    console.log('Feed start...');
    const jsonFiles = await this.getJsonFiles();
    for (const jsonFile of jsonFiles) {
      const output = await this.readJsonFile(jsonFile);
      if (!output.isFailed) {
        const exam = await this.saveExam(output.exam);
        const passers = this.buildPassersPayload(output, exam.data.data);
        await this.savePassers(passers);
      }
    }
    console.log('Feed done.');
  }

  /**
   * Get JSON Files
   */
  private getJsonFiles = async (): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      fs.readdir('./outputs', (err, files) => {
        if (err) {
          reject(err);
        }
        resolve(files);
      });
    });
  }

  /**
   * 
   */
  private readJsonFile = async (file: string): Promise<any> => {
    return  new Promise((resolve, reject) => {
      fs.readFile(`./outputs/${file}`, (err, data) => {
        if (err) reject(err);
        try {
          let parsedData = JSON.parse(data.toString());
          resolve(parsedData);
        } catch (error) {
          resolve({ exam: file + '-Failed', isFailed: true })
        }
      });
    });
  }

  /**
   * Save Exam to Server
   */
  private saveExam = async (exam: string) => {
    return await axios.post(this.apiUrl + '/exams', {
      name: exam
    });
  }

  /**
   * Build Passers Payload
   */
  private buildPassersPayload = (jsonData: any, exam: any) => {
    const { id } = exam;
    const { passers, year } = jsonData;
    const massagedPassers: any[] = [];
    for (const passer of passers) {
      massagedPassers.push({
        "firstName": "NA",
        "middleName": "NA",
        "lastName": "NA",
        "year": year,
        "month": 0,
        "fullName": passer,
        "school": "",
        "exam": id
      });
    }
    return {
      passers: massagedPassers
    };
  }

  /**
   * Save Passers to server
   */
  private savePassers = async (passersPayload: any) => {
    return await axios.post(this.apiUrl + '/passers', passersPayload);
  }

}

/**
 * Run the feeder
 */
(async () => {
  await dotenv.config();
  await new Feeder().startFeed();
})();