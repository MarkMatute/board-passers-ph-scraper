import fs from 'fs';

class JsonWriter {

    public static writeJson = async (jsonData: any, fileName: string) => {
        return new Promise((resolve, reject) => {
            fs.writeFile(`./outputs/${fileName}.json`, JSON.stringify(jsonData, null, 4), (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            })
        });
    }

}

export default JsonWriter;
