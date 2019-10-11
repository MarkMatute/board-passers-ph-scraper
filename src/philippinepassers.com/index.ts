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
    // TODO: This is temporary
    return [
      {
        exam: 'pharma licensure examination',
        href: 'https://www.philippinepassers.com/of/march-2019-pharmacist-licensure-examination/1071/a',
        year: 2019
      }
    ];
    const exams: any[] = [];
    for (let year of years) {
      console.log(`Getting exams for year: ${year}`);
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

  private getPassersForExam = async (exams: any) => {
    const passers: any[] = [];

    // Loop Exam Links
    for (let exam of exams) {

      const result = await axios.get(exam.href);
      const $ = cheerio.load(result.data);
      const letterPaginations = $('.pagination').first().find('a');

      // Letter Pagination Links
      const letterPaginationLinks: string[] = [];
      letterPaginations.map((index: number, element: CheerioElement) => {
        letterPaginationLinks.push(`${this.urlSource.replace('/examination/results', '') + element.attribs['href']}`);
      });

      // Loop Pagination Per Letters
      for (const letter of letterPaginationLinks) {
        const letterRequestResult = await axios.get(exam.href);
        const $_letterHtml = cheerio.load(result.data);

        // Get Pagination Per Letters
        // TODO: Where are the actual passers

      }
    }

    return passers;
  }

  private getLetterPaginations = () => {

  }

}

export default new PhilippinePassersScraper();
