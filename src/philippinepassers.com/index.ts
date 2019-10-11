import IScraper from '../interfaces/IScraper';
import axios from 'axios';
import cheerio from 'cheerio';
import StringHelper from '../common/StringHelpers';

class PhilippinePassersScraper implements IScraper {

  urlSource: string;
  $: any;

  constructor() {
    this.urlSource = 'https://www.philippinepassers.com/examination/results';
  }
  
  public scrape = async () => {
    const result = await axios.get(this.urlSource);
    this.$ = cheerio.load(result.data);

    const years = this.getSourcesPerYear();
    const exams = await this.getExamsPerYear(years);
    const passers = await this.getPassersForExam(exams);
    
    return passers;
  }

  private getSourcesPerYear = () => {
    const years: number[] = [];
    for (let year=2000; year <= 2019; year++) {
      years.push(year)
    }
    return years;
  }

  private getExamsPerYear = async (years: number[]) => {
    const exams: any[] = [];
    for (let year of years) {
      const result = await axios.get(`${this.urlSource}/${year}`);
      const $ = cheerio.load(result.data);
      const examContainer: Cheerio = $('#page .container:nth-child(2) .row a');
      examContainer.map((index: number, element: CheerioElement) => {
        exams.push({
          exam: StringHelper.removeMonthAndYear(element.children[0].data),
          href: this.urlSource.replace('/examination/results', '') + element.attribs['href'],
          year
        });
      });
    }
    return exams;
  }

  private getPassersForExam = (exams: any) => {
    // TODO
    // Letter
      // Pagination Per Letter
  }

}

export default new PhilippinePassersScraper();