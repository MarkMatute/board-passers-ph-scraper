import cheerio from 'cheerio';
import axios from 'axios';
import IScraper from '../interfaces/IScraper';

class ExamScraper {

  private url = 'https://www.philippinepassers.com/examination/results';

  public scrape = async () => {
    const result = await axios.get(this.url);
    const $ = cheerio.load(result.data);
    const examListWithPaginations = $('#page');
    const pagination = this.getPagination(examListWithPaginations);
  }

  private getPagination = (examListWithPaginations: Cheerio) => {
    const paginations: any[] = [];
    const pagination = examListWithPaginations.find('.pagination');
    pagination.find('a').map((index: number, element: CheerioElement) => {
      const text = element.children[0].data;
      const href = 'https://www.philippinepassers.com' + element.attribs['href'];
      paginations.push({
        [text]: href
      });
    });
    return paginations;
  }

}

export default new ExamScraper();