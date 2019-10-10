import cheerio from 'cheerio';
import axios from 'axios';
import IScraper from '../interfaces/IScraper';
import StringHelper from '../common/StringHelpers';

class ExamScraper {

  private url = 'https://www.philippinepassers.com/examination/results';
  private $: any;

  public scrape = async () => {
    const result = await axios.get(this.url);
    this.$ = cheerio.load(result.data);
    const examListWithPaginations = this.$('#page');
    const pagination = this.getPagination(examListWithPaginations);
    let extractedExams: any[] = [];
    for (let page of pagination) {
      console.log('Page: ' + page.year);
      const exams = await this.getExams(page.href);
      extractedExams = [
        ...extractedExams,
        ...exams
      ]
    }
    console.log('Exam scraper done...');
    return this.removeAllDuplicates(extractedExams);
  }

  /**
   * Remove all duplicated exam names
   */
  private removeAllDuplicates = (exams: string[]) => {
    return Array.from(new Set(exams));
  }

  /**
   * Get Paginations
   */
  private getPagination = (examListWithPaginations: Cheerio) => {
    const paginations: any[] = [];
    const pagination = examListWithPaginations.find('.pagination');
    pagination.find('a').map((index: number, element: CheerioElement) => {
      const year = element.children[0].data;
      const href = 'https://www.philippinepassers.com' + element.attribs['href'];
      paginations.push({
        year,
        href,
        crawled: false
      });
    });
    return paginations;
  }

  /**
   * Get Exam Listing per page
   */
  private getExams = async (page: string) => {
    const exams: any[] = [];
    const result = await axios.get(page);
    const $ = cheerio.load(result.data);
    const examContainer: Cheerio = $('#page .container:nth-child(2) .row a');
    examContainer.map((index: number, element: CheerioElement) => {
      exams.push(StringHelper.removeMonthAndYear(element.children[0].data));
    });
    return exams;
  }

}

export default new ExamScraper();
