import axios from 'axios';
import cheerio from 'cheerio';
import IScraper from '../../interfaces/IScraper';
import StringHelpers from '../../common/StringHelpers';
import IPasser from '../../interfaces/IPasser';
import IJsonOutput from '../../interfaces/IJsonOutput';

class Architecture2019 implements IScraper {
    
    public urlSource: string;

    constructor() {
        this.urlSource = 'http://philboardresults.com/2019/07/list-of-passers-for-june-2019-architects-ale-board-exam-results/';
    }

    public scrape = async (): Promise<IJsonOutput> => {
        const result = await axios.get(this.urlSource);
        const $ = cheerio.load(result.data);
        const entryContent = $('div.entry-content > p').text();
        const entryTexts = entryContent.split('\n');
        const passerEntries: any[] = [];
        const nameIssues:  any[] = [];
        entryTexts.map((passer) => {
            const splitPasser = passer.split(' ');
            const idCount = splitPasser[0] || '';
            const lastName = splitPasser[1] || '';
            if (StringHelpers.isNumber(idCount) && lastName.indexOf(',') > -1) {
                const name: IPasser | boolean = this.getName(passer);           
                if (name) {
                    passerEntries.push(name);
                } else {
                    nameIssues.push(passer);
                }
            }
        });
        return {
            exam: 'Architecture',
            year: 2019,
            month: 6,
            passers: passerEntries
        } as IJsonOutput;
    }

    public getName(rawString: string): IPasser | false {
        const passer = {} as IPasser;
        const splitName = rawString.toLocaleLowerCase().split(' ');
        switch(splitName.length) {
            case 3:
                passer.lastNmae = splitName[1].replace(',', '');
                passer.firstName = splitName[2];
            case 4:
                passer.lastNmae = splitName[1].replace(',', '');
                passer.firstName = splitName[2];
                passer.middleName = splitName[3];
                break;
            case 5:
                passer.lastNmae = splitName[1].replace(',', '');
                passer.firstName = splitName[2] + ' ' + splitName[3];
                passer.middleName = splitName[4];
                break;
            case 6:
                passer.lastNmae = splitName[1].replace(',', '');
                passer.firstName = splitName[2] + ' ' + splitName[3];
                passer.middleName = splitName[4] + splitName[5];
                break;
            case 7:
                passer.lastNmae = splitName[1].replace(',', '');
                passer.firstName = splitName[2] + ' ' + splitName[3];
                if (splitName[4] === 'DE') {
                    passer.middleName = splitName[4] + splitName[5] + splitName[6];
                } else {
                    passer.firstName = passer.firstName + splitName[4];
                    passer.middleName = splitName[5] + splitName[6];
                }
                break;
            default:
                if (rawString.indexOf('—– NOTHING') > -1) {
                    const correctString = rawString.split('—– NOTHING')[0];
                    return this.getName(correctString);
                }
                return false;
        }
        passer.fullName = StringHelpers.removeNumbers(rawString);
        return passer;
    }

}

export default new Architecture2019();

